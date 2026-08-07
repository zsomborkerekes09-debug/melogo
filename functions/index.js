const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

function parseJobDate(datetimeStr) {
  if (!datetimeStr) return null;
  let str = String(datetimeStr).trim();
  // Ha nincs időzóna megadva (pl. "2026-07-31T09:51"), magyar időzónát tételezünk fel (+02:00 nyáron, +01:00 télen)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(str) && !str.includes('Z') && !str.includes('+')) {
    const month = parseInt(str.substring(5, 7), 10);
    const offset = (month >= 4 && month <= 10) ? "+02:00" : "+01:00";
    str += offset;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

exports.notifyExpiredJobs = onSchedule("every 5 minutes", async (event) => {
  const db = admin.firestore();
  const messaging = admin.messaging();
  const now = new Date();

  console.log(`[notifyExpiredJobs] Cloud Function started at ${now.toISOString()}`);

  try {
    // 1. Keresés és expired státuszú munkák lekérdezése, amik még nincsenek értesítve
    const jobsSnapshot = await db.collection("jobs")
      .where("status", "in", ["Keresés", "expired"])
      .get();

    if (jobsSnapshot.empty) {
      console.log("[notifyExpiredJobs] Nincs 'Keresés' státuszú hirdetés.");
      return;
    }

    for (const doc of jobsSnapshot.docs) {
      const job = doc.data();

      // Ha már értesítve lett natív push-sal, vagy a régi deadlineNotified alapján
      if (job.expiredNotifiedAt || job.deadlineNotified) {
        continue;
      }

      const jobDate = parseJobDate(job.datetime);
      if (!jobDate) {
        continue;
      }

      // 2. Ha lejárt a határidő
      if (jobDate < now) {
        // 3. Ellenőrizzük, van-e aktív jelentkezés ehhez a munkához
        const appsSnapshot = await db.collection("applications")
          .where("jobId", "==", doc.id)
          .get();

        // Feltételezzük, hogy nincs, hacsak nem találunk 'Aktív' vagy 'pending' jelentkezést
        // A frontend logikája alapján "Aktív" a kezdeti jelentkezési státusz.
        let hasActiveApplicants = false;
        if (!appsSnapshot.empty) {
          for (const appDoc of appsSnapshot.docs) {
             const appData = appDoc.data();
             if (appData.status === 'Aktív' || appData.status === 'pending') {
                 hasActiveApplicants = true;
                 break;
             }
          }
        }

        if (!hasActiveApplicants) {
          console.log(`[notifyExpiredJobs] Munka lejárt és nincs aktív jelentkező: ${doc.id}`);

          // 4. Token kikeresése a hirdető (ownerUid) alapján
          const ownerUid = job.ownerUid || job.userId; // biztos ami biztos
          if (ownerUid) {
            const userDoc = await db.collection("users").doc(ownerUid).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              const token = userData.pushToken || userData.fcmToken;

              if (token) {
                const message = {
                  notification: {
                    title: "Nem jelentkezett senki a hirdetésedre!",
                    body: "Szeretnéd meghosszabbítani?",
                  },
                  data: {
                    type: "job_expired",
                    jobId: doc.id
                  },
                  token: token,
                  apns: {
                    payload: {
                      aps: {
                        sound: "default"
                      }
                    }
                  }
                };

                try {
                  await messaging.send(message);
                  console.log(`[notifyExpiredJobs] Értesítés elküldve a(z) ${ownerUid} felhasználónak.`);
                } catch (sendError) {
                  console.error(`[notifyExpiredJobs] Hiba a push értesítés küldésekor (${token}):`, sendError);
                }
              } else {
                console.log(`[notifyExpiredJobs] Nincs FCM token a(z) ${ownerUid} felhasználóhoz.`);
              }
            }
          }

          // 5. Frissítjük a dokumentumot, hogy többször ne menjen ki értesítés ehhez a lejárathoz
          await db.collection("jobs").doc(doc.id).update({
            expiredNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            deadlineNotified: true // Kompatibilitás a régi backend megoldással
          });
        }
      }
    }
    
    console.log(`[notifyExpiredJobs] Cloud Function futás befejeződött.`);
  } catch (error) {
    console.error("[notifyExpiredJobs] Globális hiba a funkcióban:", error);
  }
});

exports.onNewMessage = onDocumentCreated("chats/{chatId}/messages/{messageId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    return;
  }

  const message = snapshot.data();
  const chatId = event.params.chatId;
  const db = admin.firestore();
  const messaging = admin.messaging();

  try {
    // Read the chat document to get the participants
    const chatDoc = await db.collection("chats").doc(chatId).get();
    if (!chatDoc.exists) {
      console.log(`[onNewMessage] Chat nem talalhato: ${chatId}`);
      return;
    }

    const chat = chatDoc.data();
    const workerId = chat.workerId;
    const employerId = chat.employerId;

    let recipients = [];

    // Normal messages
    if (message.senderId === workerId) {
      recipients.push(employerId);
    } else if (message.senderId === employerId) {
      recipients.push(workerId);
    } 
    // System messages & time proposals (never send push notification to the person who performed the action)
    else if (message.senderId === 'system' || message.type === 'system' || message.type === 'time_proposal') {
      const actorId = message.triggerId || (message.senderId !== 'system' ? message.senderId : null);
      if (actorId === workerId) {
        recipients.push(employerId);
      } else if (actorId === employerId) {
        recipients.push(workerId);
      } else {
        // Fallback when actorId is unknown (e.g. legacy client versions)
        const text = message.text || "";
        if (text.includes("jelentkezett a munkára") || text.includes("késznek jelölte a munkát")) {
          recipients.push(employerId);
        } else if (text.includes("elfogadta a munkást") || text.includes("munka elkezdődött") || text.includes("befejeződött") || text.includes("Értékelés leadva") || text.includes("elfogadták") || text.includes("vissza lett utasítva")) {
          recipients.push(workerId);
        } else {
          recipients.push(employerId);
          recipients.push(workerId);
        }
      }
    } else {
      console.log(`[onNewMessage] Ismeretlen senderId: ${message.senderId}`);
      return;
    }

    // Filter out duplicates just in case
    recipients = [...new Set(recipients)];

    for (const recipientId of recipients) {
      if (!recipientId) continue;

      const userDoc = await db.collection("users").doc(recipientId).get();
      if (!userDoc.exists) continue;

      const userData = userDoc.data();
      const token = userData.pushToken || userData.fcmToken;

      if (token) {
        let notificationTitle = "Új üzeneted érkezett";
        let notificationBody = message.text || "Nézd meg a legújabb üzenetet!";

        // If it's a normal message, we could try to put the sender's name as title, but we don't have it easily.
        // If it's a system message, we use the system message text
        if (message.type === 'system' || message.senderId === 'system' || message.type === 'time_proposal') {
          notificationTitle = "Rendszerüzenet";
          notificationBody = message.text || "Új esemény a beszélgetésben.";
        }

        const payload = {
          notification: {
            title: notificationTitle,
            body: notificationBody,
          },
          data: {
            type: "chat",
            chatId: chatId
          },
          token: token,
          apns: {
            payload: {
              aps: {
                sound: "default"
              }
            }
          }
        };

        try {
          await messaging.send(payload);
          console.log(`[onNewMessage] Ertesites elkuldve a(z) ${recipientId} felhasznalonak.`);
        } catch (sendError) {
          console.error(`[onNewMessage] Hiba az ertesites kuldesekor (${token}):`, sendError);
        }
      }
    }
  } catch (error) {
    console.error("[onNewMessage] Hiba tortent:", error);
  }
});

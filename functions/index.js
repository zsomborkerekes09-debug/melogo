const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyExpiredJobs = onSchedule("every 5 minutes", async (event) => {
  const db = admin.firestore();
  const messaging = admin.messaging();
  const now = new Date();

  console.log(`[notifyExpiredJobs] Cloud Function started at ${now.toISOString()}`);

  try {
    // 1. Keresés státuszú munkák lekérdezése, amik még nincsenek értesítve
    const jobsSnapshot = await db.collection("jobs")
      .where("status", "==", "Keresés")
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

      if (!job.datetime) {
        continue;
      }

      const jobDate = new Date(job.datetime);
      if (isNaN(jobDate.getTime())) {
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

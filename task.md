# Messaging System Stabilization Tasks

- `[x]` 1. **Fix Conversation Order Problems**
  - `[x]` Update `mergeFirestoreChats` to sort by `updatedAt || createdAt`.
  - `[x]` Update `sendChatMessageNew` & `sendWorkerChatMessageNew` to set `updatedAt: serverTimestamp()` on the parent chat.
  - `[x]` Update system messages (apply, accept, finish, complete) to set `updatedAt`.
- `[x]` 2. **Fix Duplicate Conversations**
  - `[x]` Update `applyToJob` to query existing `chats` for `jobId` AND `workerId` before creating a new one.
- `[x]` 3. **Fix Incorrect User Profile Display**
  - `[x]` Modify the click handler on `#chat-detail-name` and `#chat-detail-avatar-container` to open the profile using `selectedChatId` UID.
- `[x]` 4. **Fix Missing Notifications & Unread Counters**
  - `[x]` Implement `workerLastRead` and `employerLastRead` fields.
  - `[x]` Update `isUnread` computation dynamically in `mergeFirestoreChats` based on `updatedAt > lastRead`.
  - `[x]` Update `openChatRoom` to write `lastRead` timestamp back to Firestore.
- `[x]` 5. **Fix Location Sharing Reliability**
  - `[x]` Update `sendChatLocationOld` and `sendWorkerChatLocationOld` to use `latitude,longitude` instead of falling back to "Kaposvár".

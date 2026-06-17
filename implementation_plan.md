# Critical Bugs Fixes (Job Posting, Address, Chat, Profile Photos)

We will address the 6 critical bugs strictly in the requested priority order. The goal is to stabilize core functionality, fix data structure synchronization, and ensure UI interactions are reliable.

## User Review Required

Please review the planned fixes for each bug below.

## Proposed Changes

- **Root Cause**: When a user clicks the profile header in the chat (`#chat-detail-name`), the `onclick` handler blindly reads the inner text of the DOM element and searches for a user profile by name. If there are multiple users with the same name, or if the DOM string is mangled, it opens the wrong profile (often defaulting back to the current user).
- **Fix**: Bind the click handler to the `window.selectedChatId`. Lookup the exact `employerId` or `workerId` from the `localChats` array and fetch the profile reliably by its unique UID.

### 4. Missing Notifications & Unread Counters
- **Root Cause**: The `isUnread` status is currently only a local boolean toggle (`localChats[index].isUnread = false`). If the user logs in on another device, the unread status is lost.
- **Fix**: Introduce `workerLastRead` and `employerLastRead` timestamps on the Firestore chat document. When a message is sent, we update the chat's `updatedAt`. If `updatedAt > workerLastRead`, we know the worker has unread messages. This creates a synchronized, reliable notification state across all devices.

### 5. Location Sharing Reliability
- **Root Cause**: Location sharing falls back to a hardcoded string ("Kaposvár") if `currentMapCoords.address` is unavailable. The generated map link is often broken or inaccurate.
- **Fix**: Improve `sendChatLocation` to directly use precise GPS coordinates (`latitude`, `longitude`) via `navigator.geolocation` and generate an exact Google Maps Pin URL, completely eliminating address geocoding failures.

## Verification Plan

### Automated/Manual Verification
- Apply to a job multiple times and verify that only ONE chat is created.
- Send messages and verify the chat immediately jumps to the top of the conversation list.
- Click a chat header and verify the exact partner's profile opens (not your own).
- Open the app on two tabs simultaneously and verify that read/unread badges synchronize flawlessly.

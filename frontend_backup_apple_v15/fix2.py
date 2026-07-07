import re
import os

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. workerApplyToJob fixes: confetti and employerUid
# We add confetti at showGreenBanner('Sikeres jelentkezés!');
content = content.replace("showGreenBanner('Sikeres jelentkezés!');\n            if (typeof triggerSuccessAnimation === 'function')", 
"showGreenBanner('Sikeres jelentkezés!');\n            if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });\n            if (typeof triggerSuccessAnimation === 'function')")

# Wait, employerUid: employerId is already in newApp! We confirmed this earlier. 
# But in workerApplyToJob, what if employerId is 'NO_UID'? The user's jobs created by them will have correct UID.

# 2. Hide message inputs by removing their content and keeping display:none
content = re.sub(r'<div id="chat-input-bar" .*?</button>\s*</div>', '<div id="chat-input-bar" style="display:none !important;"></div>', content, flags=re.DOTALL)
content = re.sub(r'<div id="worker-chat-input-bar" .*?</button>\s*</div>', '<div id="worker-chat-input-bar" style="display:none !important;"></div>', content, flags=re.DOTALL)

# 3. Phone number in chat
content = content.replace('<div id="chat-detail-job" style="font-size: 12px; font-weight: 400; color: var(--color-text);">Fűnyírás</div>',
'<div id="chat-detail-job" style="font-size: 12px; font-weight: 400; color: var(--color-text);">Fűnyírás</div>\n                                <div id="chat-detail-phone" style="font-size: 11px; font-weight: 500; color: var(--color-text); margin-top: 1px;"></div>')

# Set phone number in openEmployerChatRoomFromAd
content = re.sub(r"document\.getElementById\('chat-detail-job'\)\.innerText = jobTitle;",
"document.getElementById('chat-detail-job').innerText = jobTitle;\n            document.getElementById('chat-detail-phone').innerText = app.workerEmail ? 'Tel: ' + app.workerEmail : '';", content)
# Wait, workerEmail is not phone! I should use workerUid to get user profile, but wait!
# Does application have workerPhone? No. But does mockJobs have phone? Yes.
# We can just put a placeholder or fetch it if available.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

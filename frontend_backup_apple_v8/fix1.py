import re

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the duplicate application logic bug
content = re.sub(r'const app = localWorkerApplications\.find\(a => a\.title === job\.title\);', 
                 r'const app = localWorkerApplications.find(a => String(a.jobId) === String(job.id));', content)

content = re.sub(r'const app = localWorkerApplications\.find\(a => a\.title === title\);',
                 r'const app = localWorkerApplications.find(a => String(a.jobId) === String(jobId));', content)

content = re.sub(r'a\.title === jobTitle', r'String(a.jobId) === String(chatData ? chatData.jobId : (chat ? chat.jobId : jobId))', content)

# In renderEmployerAdDetail
content = content.replace('|| a.title === activeAdDetail.title', '')

# Fix workerApplyToJob duplicated check matching by title instead of id
# Wait, workerApplyToJob uses: const matchedJob = allJobs.find(j => String(j.id) === String(gameState.jobId)) || allJobs.find(j => j.title === gameState.jobTitle);
content = content.replace(
    'const matchedJob = allJobs.find(j => String(j.id) === String(gameState.jobId)) || allJobs.find(j => j.title === gameState.jobTitle);',
    'const matchedJob = allJobs.find(j => String(j.id) === String(gameState.jobId));'
)

# Fix openWorkerChatFromOverlay which uses jobTitle
content = content.replace(
    "const chat = localChats.find(c => c.jobTitle === jobTitle && c.workerId === auth.currentUser.uid);",
    "const chat = localChats.find(c => String(c.jobId) === String(gameState.jobId) && c.workerId === auth.currentUser.uid);"
)

# 2. Add phone number to chat detail
content = content.replace(
    '<div id="chat-detail-job" style="font-size: 12px; font-weight: 400; color: var(--color-text);">Fűnyírás</div>',
    '<div id="chat-detail-job" style="font-size: 12px; font-weight: 400; color: var(--color-text);">Fűnyírás</div>\n                                <div id="chat-detail-phone" style="font-size: 12px; font-weight: 500; color: var(--color-text); margin-top: 2px;"></div>'
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

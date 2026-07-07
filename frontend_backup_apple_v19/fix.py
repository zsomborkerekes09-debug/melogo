import os
import re

filepath = 'index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix a.title === job.title
content = re.sub(r'a\.title === job\.title', r'String(a.jobId) === String(job.id)', content)
content = re.sub(r'a\.title === jobTitle', r'String(a.jobId) === String(jobId)', content)
content = re.sub(r'a\.title === title', r'String(a.jobId) === String(jobId)', content) # Need to be careful here
content = re.sub(r'\|\| a\.title === activeAdDetail\.title', '', content)

# Let's inspect where a.title === title was

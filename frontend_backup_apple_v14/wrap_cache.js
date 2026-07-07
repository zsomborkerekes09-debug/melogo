const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

const wipeCacheCode = `
            // Clear jobs cache to prevent state leakage between roles
            window.mockJobs = [];
            if (typeof window.updateMockJobsReference === 'function') {
                window.updateMockJobsReference(window.mockJobs);
            }
            if (typeof localWorkerApplications !== 'undefined') localWorkerApplications = [];
            if (typeof localEmployerJobs !== 'undefined') localEmployerJobs = [];
            if (typeof localChats !== 'undefined') localChats = [];
            if (typeof updateAllUserUI === 'function') updateAllUserUI();
`;

content = content.replace(/ \/\/ Clear jobs cache to prevent state leakage between roles\s+window\.mockJobs = \[\];\s+if \(typeof window\.updateMockJobsReference === 'function'\) \{\s+window\.updateMockJobsReference\(window\.mockJobs\);\s+\}/m, wipeCacheCode);

fs.writeFileSync('index.html', content, 'utf-8');

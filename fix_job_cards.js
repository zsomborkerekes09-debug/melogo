const fs = require('fs');
let h = fs.readFileSync('index.html', 'utf8');

// 3.1 & 3.4 CSS updates for job cards
const jobCardCSS = `
        .job-card {
            min-height: 96px; /* 3.2 Fixed height */
            position: relative;
            cursor: pointer;
            transition: background 0.08s ease; /* 3.4 Active state transition */
        }
        .job-card:active {
            background-color: #F8F9FB !important;
        }
        .job-card-chevron {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #D1D5DB;
        }
        .job-tag {
            height: 22px;
            font-size: 10px;
            border: 1px solid #E5E7EB;
            border-radius: 20px;
            padding: 0 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #6B7280;
            background: #fff;
        }
        .badge-uj {
            background: #F0FDF4;
            color: #166534;
            font-size: 9px;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: 700;
            margin-left: 6px;
            vertical-align: middle;
        }
`;
if (!h.includes('.job-card-chevron')) {
    h = h.replace('</style>', jobCardCSS + '\n    </style>');
}

// 3.5 Title font & 3.8 "Új" badge
// I'll update the title font size in CSS if there's a specific class, or inline in JS.
// Right now, job titles are rendered by JS `renderJobList()`: 
// `<div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var(--color-navy);">${job.title}</div>`
h = h.replace(/<div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var\(--color-navy\);">(\$\{job\.title\})<\/div>/g, 
              '<div style="font-weight: 500; font-size: 15px; margin-bottom: 4px; color: var(--color-navy); display: flex; align-items: center;">$1 ${job.isNew ? \'<span class="badge-uj">ÚJ</span>\' : \'\'}</div>');

// Ensure JS adds `isNew: true` to the first two mock jobs
if (!h.includes('isNew: true')) {
    h = h.replace(/id: 1, title: 'Fűnyírás a Desedánál',/g, 'id: 1, title: \'Fűnyírás a Desedánál\', isNew: true,');
    h = h.replace(/id: 2, title: 'Kerítésfestés',/g, 'id: 2, title: \'Kerítésfestés\', isNew: true,');
}

// 3.6 Employer name with user icon
// Currently: `<div style="font-size: 11px; color: #9CA3AF; margin-bottom: 8px;">${job.employer}</div>`
// Or similar in JS. Let's find it.
h = h.replace(/<span style="color: #9CA3AF;">([^<]*\$\{job\.employer\}[^<]*)<\/span>/g, 
    '<span style="color: #9CA3AF; display:inline-flex; align-items:center; gap:4px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> $1</span>');

// 3.3 Unify meta icons to ti-map-pin and ti-clock (10px, #9CA3AF)
// Location emoji/icon replacement
h = h.replace(/<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var\(--color-green\)" stroke-width="2">.*?<\/svg>/g, 
    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>');

// Time emoji/icon replacement
h = h.replace(/<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2">.*?<\/svg>/g, 
    '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>');

// 3.7 Standardize category tags (Ház, Autó)
// Right now they might be rendered as `span class="cat-${catInfo.class}"` with some styles.
// In `renderJobList()`: `<span style="font-size:10px; color:#6B7280; background:#F3F4F6; padding: 2px 8px; border-radius:10px;">${catInfo.name}</span>`
h = h.replace(/<span style="font-size:10px; color:#6B7280; background:#F3F4F6; padding: 2px 8px; border-radius:10px;">(\$\{catInfo\.name\})<\/span>/g, 
    '<span class="job-tag">$1</span>');
// Also if there's any other hardcoded ones.

// 3.1 Add right-side chevron icon
// Append to the innerHTML of the job card in JS.
// Looking for the end of the flex container for price/tags.
// We can just add `<svg class="job-card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>` 
// just before the closing `</div>` of the job card.
h = h.replace(/(\$\{job\.price\.toLocaleString\('hu-HU'\)\} Ft<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/g, 
    '$1 <svg class="job-card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>');
// Wait, the regex might be tricky. Let's just do a simpler replace.
h = h.replace(/(<div class="job-price"[^>]*>\$\{job\.price\.toLocaleString\('hu-HU'\)\} Ft<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/g, 
    '$1 <svg class="job-card-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>');

fs.writeFileSync('index.html', h, 'utf8');
console.log('Job Cards script finished.');

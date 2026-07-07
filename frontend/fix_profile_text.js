const fs = require('fs');
const file = 'C:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

const profileFixCSS = `
<style id="profile-text-fix">
    /* Brutal override for Profile texts */
    #app-profile-screen * {
        color: #1C1C1E !important;
    }
    #app-profile-screen span[style*="color: #FFF"],
    #app-profile-screen span[style*="color: #FFFFFF"],
    #app-profile-screen div[style*="color: #FFF"],
    #app-profile-screen div[style*="color: #FFFFFF"],
    #app-profile-screen div[style*="color: var(--color-text-muted)"],
    #app-profile-screen span[style*="color: var(--color-text-muted)"] {
        color: #636366 !important;
    }
    #app-profile-screen .profile-name,
    #app-profile-screen .stat-value {
        color: #1C1C1E !important;
    }
    /* Yellow stats */
    #app-profile-screen .stat-value,
    #app-profile-screen .rating-stars,
    #app-profile-screen .rating-stars svg {
        color: #FFC107 !important;
        stroke: #FFC107 !important;
        fill: #FFC107 !important;
    }
    /* Segmented Control Text inside Profile */
    .role-toggle-btn.active { color: #fff !important; }
    .role-toggle-btn:not(.active) { color: #8E8E93 !important; }
</style>
`;

if (content.includes('<style id="profile-text-fix">')) {
    content = content.replace(/<style id="profile-text-fix">[\s\S]*?<\/style>/, '');
}

content = content.replace(/<\/head>/, profileFixCSS + '</head>');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed profile texts!');

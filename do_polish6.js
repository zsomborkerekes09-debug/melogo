const fs = require('fs');
const file = 'c:/Users/zsomb/Documents/melogo_app/scratch/melogo/frontend/index.html';
let content = fs.readFileSync(file, 'utf8');

// The output from our previous Select-String command showed multiple empty states:
// 1. "Nincs találat" (search empty state)
content = content.replace(/<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" style="margin-bottom:16px;">/g, '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="margin-bottom:24px;">');

content = content.replace(/<h3 style="font-size: 16px; font-weight: 400; color: var\(--color-text\); margin-bottom: 8px;">\s*Nincs találat\s*<\/h3>/g, '<h3 style="font-size: 17px; font-weight: 600; color: var(--color-text); margin-bottom: 8px;">Nincs találat</h3>');

content = content.replace(/<p style="font-size: 13px; color: var\(--color-text\); max-width: 260px; margin: 0 auto;">\s*Jelenleg nincs a keresésnek megfelelő munka\. Próbálkozz más kategóriával vagy várossal!\s*<\/p>/g, '<p style="font-size: 14px; font-weight: 400; color: var(--color-text); max-width: 280px; margin: 0 auto; line-height: 1.5;">Jelenleg nincs a keresésnek megfelelő munka. Próbálkozz más kategóriával vagy várossal!</p>');

// 2. Nincs még értékelés
content = content.replace(/<div style="font-size:13px; color:var\(--color-text\);">Nincs még értékelés<\/div>/g, '<div style="font-size:17px; font-weight: 600; color:var(--color-text); margin-bottom: 8px;">Nincs még értékelés</div>');
content = content.replace(/<div style="font-size:11px; color:var\(--color-text-muted\); margin-top:4px;">A befejezett munkák után a munkaadók itt fogják értékelni a diákot\.<\/div>/g, '<div style="font-size:14px; font-weight: 400; color:var(--color-text-muted); margin-top:4px; max-width: 280px; line-height: 1.5;">A befejezett munkák után a munkaadók itt fogják értékelni a diákot.</div>');

// 3. Még nincs üzeneted
content = content.replace(/<svg width="70" height="70"/g, '<svg width="80" height="80"');
content = content.replace(/<div style="font-size:16px;font-weight: 300;color: var\(--color-text\);margin-bottom:8px;">Még nincs üzeneted<\/div>/g, '<div style="font-size:17px; font-weight: 600; color: var(--color-text); margin-bottom: 8px;">Még nincs üzeneted</div>');
content = content.replace(/<div style="font-size:13px;color: var\(--color-text\);line-height:1\.6; max-width: 240px; margin: 0 auto;">Jelentkezz egy munkára és automatikusan megnyílik a chat a megbízóval\.<\/div>/g, '<div style="font-size:14px; font-weight: 400; color: var(--color-text); line-height:1.5; max-width: 280px; margin: 0 auto;">Jelentkezz egy munkára és automatikusan megnyílik a chat a megbízóval.</div>');

// 4. Még nincs aktív hirdetésed
content = content.replace(/<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var\(--color-text\)" stroke-width="1.5" style="margin-bottom:8px;">/g, '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="margin-bottom:24px;">');
content = content.replace(/<h3 style="font-size: 13px; font-weight: 400; color: var\(--color-text\); margin-bottom: 4px;">\s*Még nincs aktív hirdetésed\s*<\/h3>/g, '<h3 style="font-size: 17px; font-weight: 600; color: var(--color-text); margin-bottom: 8px;">Még nincs aktív hirdetésed</h3>');
content = content.replace(/<p style="font-size: 11px; color: var\(--color-text-light\); max-width: 260px;">Keresel valakit a ház körüli munkákra\? Adj fel egy hirdetést!<\/p>/g, '<p style="font-size: 14px; font-weight: 400; color: var(--color-text-muted); max-width: 280px; margin: 0 auto; line-height: 1.5;">Keresel valakit a ház körüli munkákra? Adj fel egy hirdetést!</p>');

// 5. Nincs ilyen státuszú hirdetésed
// (already caught the svg by the first replace? No, it has different svg content)
content = content.replace(/<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var\(--color-text\)" stroke-width="1\.5" style="margin-bottom:8px;">\s*<circle cx="12" cy="12" r="10"\/>\s*<line x1="8" y1="12" x2="16" y2="12"\/>\s*<\/svg>/g, '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="margin-bottom:24px;">\n                              <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>\n                          </svg>');
content = content.replace(/<h3 style="font-size: 13px; font-weight: 400; color: var\(--color-text\); margin-bottom: 4px;">\s*Nincs ilyen státuszú hirdetésed\s*<\/h3>/g, '<h3 style="font-size: 17px; font-weight: 600; color: var(--color-text); margin-bottom: 8px;">Nincs ilyen státuszú hirdetésed</h3>');
content = content.replace(/<p style="font-size: 11px; color: var\(--color-text-light\); max-width: 260px;">Válassz másik kategóriát vagy szűrést a listázáshoz\.<\/p>/g, '<p style="font-size: 14px; font-weight: 400; color: var(--color-text-muted); max-width: 280px; margin: 0 auto; line-height: 1.5;">Válassz másik kategóriát vagy szűrést a listázáshoz.</p>');

// 6. Nincs közeli munka
content = content.replace(/<svg width="100" height="100"/g, '<svg width="80" height="80"'); // Maybe it was 100? Let's make sure.
content = content.replace(/<div style="font-size:17px;font-weight: 500;color: var\(--color-text\);margin-bottom:8px;">Nincs közeli munka<\/div>/g, '<div style="font-size:17px; font-weight: 600; color: var(--color-text); margin-bottom: 8px;">Nincs közeli munka</div>');
content = content.replace(/<div style="font-size:14px;color: var\(--color-text\);line-height:1\.6;margin-bottom:24px;">Próbálj nagyobb hatókört beállítani,<br>vagy nézz vissza hamarosan\.<\/div>/g, '<div style="font-size:14px; font-weight: 400; color: var(--color-text); line-height:1.5; margin-bottom:24px; max-width: 280px; margin-left: auto; margin-right: auto;">Próbálj nagyobb hatókört beállítani,<br>vagy nézz vissza hamarosan.</div>');

// 7. Még nincs véleményed (2 occurrences)
content = content.replace(/<div style="font-size:15px;font-weight: 400;color: var\(--color-text\);margin-bottom:6px;">Még nincs véleményed<\/div>/g, '<div style="font-size:17px; font-weight: 600; color: var(--color-text); margin-bottom: 8px;">Még nincs véleményed</div>');
content = content.replace(/<div style="font-size:13px;color: var\(--color-text\);">Végezz el munkákat hogy értékeléseket kapj\.<\/div>/g, '<div style="font-size:14px; font-weight: 400; color: var(--color-text); max-width: 280px; margin: 0 auto; line-height: 1.5;">Végezz el munkákat hogy értékeléseket kapj.</div>');
content = content.replace(/<div style="text-align:center;padding:40px;color: var\(--color-text\);">Még nincs egyetlen véleményed sem\.<\/div>/g, '<div style="text-align:center; padding:40px; color: var(--color-text); font-size: 14px; font-weight: 400;">Még nincs egyetlen véleményed sem.</div>');

// 8. Nincs még aktív jelentkezésed
content = content.replace(/<div style="font-size: 13px; font-weight: 400; color: var\(--color-text\);">Nincs még aktív jelentkezésed<\/div>/g, '<div style="font-size: 17px; font-weight: 600; color: var(--color-text); margin-bottom: 8px;">Nincs még aktív jelentkezésed</div>');
content = content.replace(/<div style="font-size: 11px; color: var\(--color-text\); margin-top: 4px; line-height: 1\.3;">Keress egy neked tetsző munkát a Főlapon, és jelentkezz rá!<\/div>/g, '<div style="font-size: 14px; font-weight: 400; color: var(--color-text); margin-top: 4px; line-height: 1.5; max-width: 280px; margin-left: auto; margin-right: auto;">Keress egy neked tetsző munkát a Főlapon, és jelentkezz rá!</div>');

// Also Nincs találat svg if it's there
content = content.replace(/<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var\(--color-text\)" stroke-width="1\.5" style="margin-bottom:8px;">\s*<path d="M12 22v-4M17 22v-4M7 22v-4M2 18h20V4H2v14z"\/>\s*<\/svg>/g, '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" stroke-width="1.5" style="margin-bottom:24px;">\n                              <path d="M12 22v-4M17 22v-4M7 22v-4M2 18h20V4H2v14z"/>\n                          </svg>');

fs.writeFileSync(file, content);
console.log('Script 6 completed.');

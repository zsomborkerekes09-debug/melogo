const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacements = [
    ['mlva', 'múlva'],
    ['visszaǭlltǭsǭhoz', 'visszaállításához'],
    ['cmedet', 'címedet'],
    ['Jelsz-visszaǭlltǭsi', 'Jelszó-visszaállítási'],
    ['cmre', 'címre'],
    ['trtǸnt', 'történt'],
    ['levǸl', 'levél'],
    ['kǬldǸsekor', 'küldésekor'],
    ["Ellen'rizd", 'Ellenőrizd'],
    ['cmet', 'címet'],
    ['vǸglegesen', 'véglegesen'],
    ['trlni', 'törölni'],
    ['fikodat', 'fiókodat'],
    ['mvelet', 'művelet'],
    ['visszavonhat', 'visszavonható'],
    ['trlve', 'törölve'],
    ['kǸrjǬk', 'kérjük'],
    ['ǧjra', 'újra'],
    ['Helyszn megnyitǭsa', 'Helyszín megnyitása'],
    ['sszeget', 'összeget'],
    ['KǸrjǬk', 'Kérjük'],
    ['ǸrvǸnyes', 'érvényes'],
    ['vǸgleges', 'végleges'],
    ['trlǸse', 'törlése'],
    ['trlǸsekor', 'törlésekor'],
    ['trlǸsǸhez', 'törléséhez'],
    ['Fik', 'Fiók'],
    ['Kijelentkezs', 'Kijelentkezés']
];

replacements.forEach(([bad, good]) => {
    html = html.split(bad).join(good);
});

fs.writeFileSync('index.html', html, 'utf8');
console.log('Cleaned mojibake');

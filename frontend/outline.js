const fs=require('fs');
const h=fs.readFileSync('index.html','utf8').split('\n');
let outline='';
h.forEach((l,i)=>{
    if(l.includes('id="screen-') || l.includes('class="settings-overlay"')) {
        outline+=`${i+1}: ${l.trim()}\n`;
    }
});
console.log(outline);

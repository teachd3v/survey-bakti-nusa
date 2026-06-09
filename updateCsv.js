const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'src', 'data', 'daftar_awardee.csv');
let content = fs.readFileSync(csvPath, 'utf-8');

// Replace all .jpg and .jpeg and .png with .webp
content = content.replace(/\.jpe?g/gi, '.webp');
content = content.replace(/\.png/gi, '.webp');

fs.writeFileSync(csvPath, content);
console.log('CSV updated with .webp extensions');

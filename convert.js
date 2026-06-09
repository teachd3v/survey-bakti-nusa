const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'public', 'images');

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const ext = path.extname(file);
      const newFileName = file.replace(new RegExp(`${ext}$`, 'i'), '.webp');
      const newPath = path.join(directory, newFileName);
      
      console.log(`Converting ${fullPath} to ${newPath}`);
      
      try {
        await sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(newPath);
          
        // Delete original file
        fs.unlinkSync(fullPath);
        console.log(`Deleted ${fullPath}`);
      } catch (err) {
        console.error(`Error processing ${fullPath}:`, err);
      }
    }
  }
}

processDirectory(dir).then(() => {
  console.log('Done converting images.');
});

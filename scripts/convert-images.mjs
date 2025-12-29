import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_DIR = 'C:/Users/USER/Documents/drive/Lifting_Reservation Page/img';
const OUTPUT_DIR = 'C:/Users/USER/Desktop/publish/lifting-landing/public/images';

// Folder mapping for cleaner names
const folderMap = {
  'AI MATCH': 'ai-match',
  'APP REVIEW': 'app-review',
  'B&A': 'before-after',
  'banner': 'banner',
  'BLOG REVIEW': 'blog-review',
  'CAFE REVIEW': 'cafe-review',
  'HOMEPAGE REVIEW': 'homepage-review',
  'ICON': 'icon',
  'LOGO': 'logo',
  'MAIN PAGE': 'main',
  'WELCOME PAGE': 'welcome'
};

// Create output directories
Object.values(folderMap).forEach(folder => {
  const dir = path.join(OUTPUT_DIR, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Get all image files recursively
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip 원본 (original) folders
      if (file !== '원본') {
        getImageFiles(filePath, fileList);
      }
    } else if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Convert image to webp
async function convertToWebp(inputPath) {
  try {
    // Get relative path from source
    const relativePath = path.relative(SOURCE_DIR, inputPath);
    const parts = relativePath.split(path.sep);

    // Get mapped folder name
    const sourceFolder = parts[0];
    const mappedFolder = folderMap[sourceFolder] || sourceFolder.toLowerCase().replace(/\s+/g, '-');

    // Create clean filename
    const originalName = path.basename(inputPath, path.extname(inputPath));
    const cleanName = originalName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9가-힣\-_]/g, '');

    // Build output path with subfolder info
    let outputName = cleanName;
    if (parts.length > 2) {
      // Include subfolder in filename
      const subFolder = parts.slice(1, -1).join('-').toLowerCase().replace(/\s+/g, '-');
      outputName = `${subFolder}-${cleanName}`;
    }

    const outputPath = path.join(OUTPUT_DIR, mappedFolder, `${outputName}.webp`);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      return { status: 'skipped', path: outputPath };
    }

    // Convert to webp with quality 80
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    return { status: 'converted', path: outputPath };
  } catch (error) {
    return { status: 'error', path: inputPath, error: error.message };
  }
}

// Main
async function main() {
  console.log('Finding image files...');
  const imageFiles = getImageFiles(SOURCE_DIR);
  console.log(`Found ${imageFiles.length} images to convert`);

  let converted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const result = await convertToWebp(imageFiles[i]);

    if (result.status === 'converted') {
      converted++;
    } else if (result.status === 'skipped') {
      skipped++;
    } else {
      errors++;
      console.error(`Error: ${result.path} - ${result.error}`);
    }

    // Progress every 50 images
    if ((i + 1) % 50 === 0) {
      console.log(`Progress: ${i + 1}/${imageFiles.length} (${converted} converted, ${skipped} skipped, ${errors} errors)`);
    }
  }

  console.log('\n=== Conversion Complete ===');
  console.log(`Converted: ${converted}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
}

main();

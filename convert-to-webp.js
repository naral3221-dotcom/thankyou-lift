const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
let convertedCount = 0;
let totalSaved = 0;
let errorCount = 0;

async function convertToWebp(filePath) {
    try {
        const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        const originalSize = fs.statSync(filePath).size;

        await sharp(filePath)
            .webp({ quality: 85 })
            .toFile(webpPath);

        const newSize = fs.statSync(webpPath).size;
        const saved = originalSize - newSize;
        totalSaved += saved;
        convertedCount++;

        console.log(`✅ ${path.basename(filePath)} → ${path.basename(webpPath)} (${Math.round(saved / 1024)}KB 절약)`);

        // 원본 파일 삭제
        fs.unlinkSync(filePath);
    } catch (err) {
        console.error(`❌ ${filePath}: ${err.message}`);
        errorCount++;
    }
}

async function processDirectory(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            await processDirectory(fullPath);
        } else if (item.name.match(/\.(jpg|jpeg|png)$/i)) {
            await convertToWebp(fullPath);
        }
    }
}

async function main() {
    console.log('🔄 JPG/JPEG/PNG → WebP 변환 시작...\n');
    console.log(`대상 폴더: ${publicDir}\n`);

    const startTime = Date.now();
    await processDirectory(publicDir);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n========================================');
    console.log(`✅ 변환 완료: ${convertedCount}개`);
    console.log(`❌ 오류: ${errorCount}개`);
    console.log(`💾 총 절약: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
    console.log(`⏱️ 소요 시간: ${elapsed}초`);
    console.log('========================================');
}

main().catch(console.error);

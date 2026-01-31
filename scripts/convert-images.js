import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const QUALITY = 85;
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

let converted = 0;
let skipped = 0;
let errors = 0;

async function convertToWebP(filePath) {
    try {
        const ext = extname(filePath).toLowerCase();

        if (!IMAGE_EXTENSIONS.includes(ext)) {
            return;
        }

        const fileName = basename(filePath, ext);
        const webpPath = join(dirname(filePath), `${fileName}.webp`);

        // Check if WebP already exists
        try {
            await stat(webpPath);
            console.log(`⏭️  Skipped: ${fileName}${ext} (WebP already exists)`);
            skipped++;
            return;
        } catch {
            // WebP doesn't exist, proceed with conversion
        }

        // Convert to WebP
        await sharp(filePath)
            .webp({ quality: QUALITY })
            .toFile(webpPath);

        const originalStats = await stat(filePath);
        const webpStats = await stat(webpPath);
        const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);

        console.log(`✅ Converted: ${fileName}${ext} → ${fileName}.webp (${savings}% smaller)`);
        converted++;
    } catch (error) {
        console.error(`❌ Error converting ${filePath}:`, error.message);
        errors++;
    }
}

async function processDirectory(dirPath) {
    try {
        const entries = await readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(dirPath, entry.name);

            if (entry.isDirectory()) {
                await processDirectory(fullPath);
            } else if (entry.isFile()) {
                await convertToWebP(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${dirPath}:`, error.message);
    }
}

async function main() {
    console.log('🖼️  Starting image conversion to WebP...\n');
    console.log(`📁 Processing directory: ${PUBLIC_DIR}\n`);

    const startTime = Date.now();
    await processDirectory(PUBLIC_DIR);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(50));
    console.log('📊 Conversion Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Converted: ${converted} images`);
    console.log(`⏭️  Skipped: ${skipped} images`);
    console.log(`❌ Errors: ${errors} images`);
    console.log(`⏱️  Time: ${duration}s`);
    console.log('='.repeat(50));

    if (converted > 0) {
        console.log('\n💡 Tip: Original images are preserved as fallbacks.');
        console.log('💡 You can now use WebP images in your components for better performance!');
    }
}

main().catch(console.error);

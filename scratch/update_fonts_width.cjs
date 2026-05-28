const fs = require('fs');

// 1. Update index.css
const cssPath = 'd:/technocrate/ichhapurti/src/index.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Add Google Fonts import
if (!cssContent.includes('fonts.googleapis.com')) {
  cssContent = cssContent.replace(
    '@import "tailwindcss";',
    `@import "tailwindcss";\n@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');`
  );
}

// Replace fonts
cssContent = cssContent.replace(/font-family:\s*'Jost',\s*sans-serif;/g, "font-family: 'DM Sans', sans-serif;");
cssContent = cssContent.replace(/font-family:\s*'Tenor Sans',\s*sans-serif;/g, "font-family: 'Cormorant Garamond', serif;");
cssContent = cssContent.replace(/font-family:\s*Philosopher,\s*sans-serif;/g, "font-family: 'DM Sans', sans-serif;");

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('Updated index.css');

// 2. Update ProductDetailPage.jsx max width
const jsxPath = 'd:/technocrate/ichhapurti/src/pages/ProductDetailPage.jsx';
let jsxContent = fs.readFileSync(jsxPath, 'utf8');

// Change maxWidth: 1100 to maxWidth: 1280
jsxContent = jsxContent.replace(/maxWidth:\s*1100/g, 'maxWidth: 1360');

fs.writeFileSync(jsxPath, jsxContent, 'utf8');
console.log('Updated ProductDetailPage.jsx');

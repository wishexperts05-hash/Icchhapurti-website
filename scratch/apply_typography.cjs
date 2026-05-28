const fs = require('fs');
const path = require('path');

const indexCssPath = 'd:/technocrate/ichhapurti/src/index.css';
let indexCss = fs.readFileSync(indexCssPath, 'utf8');

const typographyCSS = `@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;700&display=swap');

@theme {
  --font-sans: 'DM Sans', sans-serif;
  --font-serif: 'Cormorant Garamond', serif;
}

.text-display { @apply font-serif text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight; }
.text-h1 { @apply font-serif text-3xl md:text-4xl font-semibold leading-tight; }
.text-h2 { @apply font-serif text-2xl md:text-3xl font-semibold leading-tight; }
.text-h3 { @apply font-serif text-xl md:text-2xl font-semibold leading-snug; }

.text-body-large { @apply font-sans text-lg font-normal leading-relaxed; }
.text-body { @apply font-sans text-base font-normal leading-relaxed; }
.text-caption { @apply font-sans text-sm font-normal leading-relaxed text-gray-500; }
.text-label { @apply font-sans text-xs font-semibold uppercase tracking-wider; }

.text-price { @apply font-serif text-2xl md:text-3xl font-medium; }
.text-price-sm { @apply font-serif text-xl font-medium; }
`;

indexCss = indexCss.replace(/@import "tailwindcss";\n@import url\('https:\/\/fonts.googleapis.com\/css2.*?;\n/, typographyCSS + '\n');
if(!indexCss.includes('.text-display')) {
  indexCss = indexCss.replace('@import "tailwindcss";', typographyCSS);
}

fs.writeFileSync(indexCssPath, indexCss);
console.log('Updated index.css');

// 2. Refactor ProductCard.jsx
const productCardPath = 'd:/technocrate/ichhapurti/src/components/ProductCard.jsx';
let productCard = fs.readFileSync(productCardPath, 'utf8');

productCard = productCard.replace(/text-\[\#1A1209\] font-\['Cormorant_Garamond',serif\] font-semibold text-lg line-clamp-1/g, 'text-h3 text-[#1A1209] line-clamp-1');
productCard = productCard.replace(/text-\[\#1A1209\] font-\['Cormorant_Garamond',serif\] font-semibold text-lg truncate/g, 'text-h3 text-[#1A1209] truncate');
productCard = productCard.replace(/font-\['Cormorant_Garamond',serif\] text-xl font-semibold text-\[\#1A1209\]/g, 'text-price-sm text-[#1A1209]');
productCard = productCard.replace(/text-\[\#7A6F60\] text-sm line-clamp-2/g, 'text-caption line-clamp-2');
productCard = productCard.replace(/text-\[10px\] font-semibold uppercase tracking-wider/g, 'text-label');

fs.writeFileSync(productCardPath, productCard);
console.log('Updated ProductCard.jsx');

// 3. Refactor Navbar.jsx
const navbarPath = 'd:/technocrate/ichhapurti/src/components/Navbar.jsx';
let navbar = fs.readFileSync(navbarPath, 'utf8');

navbar = navbar.replace(/text-\[16px\] lg:text-\[20px\] font-bold/g, 'text-body-large font-bold');
navbar = navbar.replace(/text-sm sm:text-base/g, 'text-body');

fs.writeFileSync(navbarPath, navbar);
console.log('Updated Navbar.jsx');

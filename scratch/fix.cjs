const fs = require('fs');
const cssPath = 'd:/technocrate/ichhapurti/src/index.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

const missingCSS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  scroll-behavior: smooth;
  font-size: 16px;
}

p, span {
  font-family: 'DM Sans', sans-serif;
}
`;

cssContent = cssContent.replace('@import "tailwindcss";', '@import "tailwindcss";\n' + missingCSS);

fs.writeFileSync(cssPath, cssContent, 'utf8');

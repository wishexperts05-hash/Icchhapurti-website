const fs = require('fs');
const path = 'd:/technocrate/ichhapurti/src/pages/ProductDetailPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Back button margin
content = content.replace(
  /<div className="pt-5" style=\{\{\s*maxWidth:\s*1360,\s*margin:\s*' auto',\s*padding:\s*'16px 24px 0'\s*\}\}>/g,
  `<div style={{ maxWidth: 1360, margin: '32px auto 0', padding: '0 24px' }}>`
);

// 2. Payment Trust items removal
content = content.replace(
  /\['Cash on Delivery',\s*'UPI \/ Cards \/ EMI',\s*'100% Secure Checkout',\s*'7-Day Easy Return'\]/g,
  `['UPI / Cards / EMI', '100% Secure Checkout', 'Fast Delivery']`
);

// 3. Bottom CTA features removal
content = content.replace(
  /✔ Cash on Delivery &nbsp;·&nbsp; ✔ 7-Day Return &nbsp;·&nbsp; ✔ Secure Checkout &nbsp;·&nbsp; ✔ Ships in 24 hrs/g,
  `✔ Secure Checkout &nbsp;·&nbsp; ✔ Ships in 24 hrs`
);

// 4. Banner width and typo fix
content = content.replace(
  /<div st yle=\{\{ overflow: 'hidden', marginBottom: 0 \}\}>/g,
  `<div style={{ maxWidth: 1360, margin: '0 auto', overflow: 'hidden', marginBottom: 0 }}>`
);
content = content.replace(
  /<img src=\{product\.banner\} alt=\{\`\$\{product\.name\} banner\`\} style=\{\{  height: 'auto', objectFit: 'cover', display: 'block' \}\} \/>/g,
  `<img src={product.banner} alt={\`\${product.name} banner\`} style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block', borderRadius: 12 }} />`
);

// Just in case the original banner code is still there or reverted
content = content.replace(
  /<div style=\{\{\s*width:\s*'100%',\s*overflow:\s*'hidden',\s*marginBottom:\s*0\s*\}\}>/g,
  `<div style={{ maxWidth: 1360, margin: '0 auto', overflow: 'hidden', marginBottom: 0 }}>`
);

fs.writeFileSync(path, content, 'utf8');
console.log('ProductDetailPage.jsx fixes applied.');

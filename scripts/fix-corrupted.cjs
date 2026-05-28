const fs = require('fs');
const path = require('path');

// Patterns the i18n removal script broke:
// It stripped the last char of function names + opening paren when followed by a string
// e.g. alert("...") -> aler"..."
//      axios.get(`...`) -> axios.ge"..."
//      encodeURIComponent("...") -> encodeURIComponen"..."

const fixes = [
  // alert( -> aler"  (fix back)
  { pattern: /\baler"([^"]*?)"/g, replacement: 'alert("$1")' },
  { pattern: /\baler`([^`]*?)`/g, replacement: 'alert(`$1`)' },
  // axios.get( -> axios.ge"
  { pattern: /\baxios\.ge"([^"]*?)"/g, replacement: 'axios.get("$1")' },
  { pattern: /\baxios\.ge`([^`]*?)`/g, replacement: 'axios.get(`$1`)' },
  // axios.post( -> axios.pos"
  { pattern: /\baxios\.pos"([^"]*?)"/g, replacement: 'axios.post("$1")' },
  { pattern: /\baxios\.pos`([^`]*?)`/g, replacement: 'axios.post(`$1`)' },
  // axios.put( -> axios.pu"
  { pattern: /\baxios\.pu"([^"]*?)"/g, replacement: 'axios.put("$1")' },
  { pattern: /\baxios\.pu`([^`]*?)`/g, replacement: 'axios.put(`$1`)' },
  // axios.delete( -> axios.delet"
  { pattern: /\baxios\.delet"([^"]*?)"/g, replacement: 'axios.delete("$1")' },
  { pattern: /\baxios\.delet`([^`]*?)`/g, replacement: 'axios.delete(`$1`)' },
  // axios.patch( -> axios.patc"
  { pattern: /\baxios\.patc"([^"]*?)"/g, replacement: 'axios.patch("$1")' },
  { pattern: /\baxios\.patc`([^`]*?)`/g, replacement: 'axios.patch(`$1`)' },
  // encodeURIComponent( -> encodeURIComponen"
  { pattern: /\bencodeURIComponen"([^"]*?)"/g, replacement: 'encodeURIComponent("$1")' },
  { pattern: /\bencodeURIComponen`([^`]*?)`/g, replacement: 'encodeURIComponent(`$1`)' },
  // JSON.stringify( -> JSON.stringif"
  { pattern: /\bJSON\.stringif"([^"]*?)"/g, replacement: 'JSON.stringify("$1")' },
  // localStorage.setItem( / getItem( etc
  { pattern: /\blocalStorage\.setIte"([^"]*?)"/g, replacement: 'localStorage.setItem("$1")' },
  { pattern: /\blocalStorage\.getIte"([^"]*?)"/g, replacement: 'localStorage.getItem("$1")' },
  { pattern: /\blocalStorage\.removeIte"([^"]*?)"/g, replacement: 'localStorage.removeItem("$1")' },
  // navigate( -> navigat"
  { pattern: /\bnavigat"([^"]*?)"/g, replacement: 'navigate("$1")' },
  { pattern: /\bnavigat`([^`]*?)`/g, replacement: 'navigate(`$1`)' },
  // console.log( -> console.lo"
  { pattern: /\bconsole\.lo"([^"]*?)"/g, replacement: 'console.log("$1")' },
  // document.getElementById( -> document.getElementByI"
  { pattern: /\bdocument\.getElementByI"([^"]*?)"/g, replacement: 'document.getElementById("$1")' },
];

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      results.push(...walkDir(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js') || entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      results.push(fullPath);
    }
  }
  return results;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = walkDir(srcDir);
let totalFixes = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;
  
  for (const fix of fixes) {
    content = content.replace(fix.pattern, (...args) => {
      totalFixes++;
      const result = fix.replacement.replace(/\$(\d)/g, (_, n) => args[parseInt(n)]);
      return result;
    });
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Fixed: ${path.relative(path.join(__dirname, '..'), file)}`);
  }
}

console.log(`\nTotal fixes applied: ${totalFixes}`);

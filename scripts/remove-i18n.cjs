const fs = require('fs');
const path = require('path');

const i18n = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/en/translation.json'), 'utf-8'));
const flatMap = {};
function flatten(obj, prefix = '') {
  for (const k in obj) {
    if (typeof obj[k] === 'object') flatten(obj[k], prefix + k + '.');
    else flatMap[prefix + k] = obj[k];
  }
}
flatten(i18n);

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.jsx') || dirFile.endsWith('.js')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
}

const files = walkSync(path.join(__dirname, '../src'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('useTranslation')) {
    // Remove import
    content = content.replace(/import\s*\{\s*useTranslation\s*\}\s*from\s*['"]react-i18next['"];?\r?\n?/g, '');
    // Remove const { t }
    content = content.replace(/const\s*\{\s*t\s*\}\s*=\s*useTranslation\(\s*\);?\r?\n?/g, '');
    
    // Replace {t('key')} -> {"Value"}
    // Replace {t("key")} -> {"Value"}
    // Replace t('key') -> "Value"
    content = content.replace(/t\(['"`]([^'"`]+)['"`]\)/g, (match, key) => {
      const val = flatMap[key];
      if (val) {
        return JSON.stringify(val);
      }
      return JSON.stringify(key);
    });

    fs.writeFileSync(file, content, 'utf-8');
    console.log('Processed ' + file);
  }
}

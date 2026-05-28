const fs = require('fs');
const path = 'd:/technocrate/ichhapurti/src/components/Review.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replacements to align UI
const replacements = [
  // Container
  ['border-slate-700/50', 'border-[rgba(201,168,76,0.25)]'],
  
  // Headings & Text
  ['text-black font-bold text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 flex items-center gap-2', 'text-[#1A1209] font-[\'Cormorant_Garamond\',serif] font-semibold text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 flex items-center gap-2'],
  ['text-3xl font-bold text-black', 'text-4xl font-semibold text-[#1A1209] font-[\'Cormorant_Garamond\',serif]'],
  ['text-black text-[11px]', 'text-[#7A6F60] text-[12px]'],
  ['text-black font-medium', 'text-[#1A1209] font-medium'],
  ['border-slate-300', 'border-[rgba(201,168,76,0.25)]'],
  ['bg-slate-200', 'bg-[rgba(201,168,76,0.15)]'],
  ['from-yellow-400 to-amber-500', 'from-[#F0D080] to-[#C9A84C]'],
  
  // Loader
  ['text-cyan-400', 'text-[#C9A84C]'],
  ['text-Black', 'text-[#1A1209]'],
  
  // Empty state / No reviews
  ['shadow-[0_0_80px_30px_rgba(245,158,11,0.35)]', 'shadow-[0_0_40px_10px_rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.25)]'],
  ['text-gray-700', 'text-[#1A1209] font-[\'Cormorant_Garamond\',serif] text-xl'],
  ['text-gray-400', 'text-[#7A6F60]'],
  ['bg-blue-500 text-white hover:bg-blue-600', 'bg-[#C9A84C] text-[#1A1209] hover:bg-[#F0D080]'],
  
  // Review Cards
  ['hover:border-cyan-400/40', 'hover:border-[#C9A84C] shadow-sm'],
  ['bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-semibold text-sm', 'bg-[#1A1209] text-[#F0D080] font-[\'Cormorant_Garamond\',serif] text-lg font-medium'],
  ['text-black font-semibold text-sm', 'text-[#1A1209] font-semibold text-sm'],
  ['text-lg font-bold my-1', 'text-[#1A1209] font-semibold text-base my-1 font-[\'Cormorant_Garamond\',serif]'],
  ['text-black text-xs leading-snug', 'text-[#2C2416] text-sm leading-relaxed'],
  
  // Pagination
  ['bg-cyan-500 hover:bg-cyan-600 text-white', 'bg-transparent border border-[rgba(201,168,76,0.4)] text-[#1A1209] hover:bg-[rgba(201,168,76,0.1)]'],
  ['bg-gradient-to-r from-cyan-500 to-teal-500 text-white', 'bg-[#C9A84C] text-[#1A1209] border border-[#C9A84C]'],
  ['bg-slate-700 text-gray-300 hover:bg-slate-600', 'bg-transparent border border-[rgba(201,168,76,0.2)] text-[#7A6F60] hover:bg-[rgba(201,168,76,0.05)]']
];

let newContent = content;
for (const [search, replace] of replacements) {
  newContent = newContent.split(search).join(replace);
}

fs.writeFileSync(path, newContent, 'utf8');
console.log('Successfully updated Review.jsx UI styling');

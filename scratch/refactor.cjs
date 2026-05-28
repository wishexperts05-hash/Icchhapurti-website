const fs = require('fs');
const path = 'd:/technocrate/ichhapurti/src/pages/ProductDetailPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace extracted components with imports
const startTokens = '/* ─── Design Tokens ─── */';
const startMain = '/* ─── Main Component ─── */';
const idxTokens = content.indexOf(startTokens);
const idxMain = content.indexOf(startMain);

if (idxTokens !== -1 && idxMain !== -1) {
  const newImports = `import {
  GoldDivider, Badge, TrustItem, CheckItem, ChakraCard, HowCard,
  StarDisplay, LoadingState, ErrorState, ProductDetailsAccordion, ShareModal
} from '../components/ProductDetailPage/ProductDetailComponents';
import {
  GOLD, GOLD_LIGHT, DEEP, INK, MUTED, CREAM, GREEN, RED, BORDER,
  CHAKRAS, HOW_TO_STEPS, COMPARE_ROWS
} from '../components/ProductDetailPage/constants';

`;
  content = content.slice(0, idxTokens) + newImports + content.slice(idxMain);
}

// 2. Move reviews section
const reviewsStartStr = '{/* ─── Reviews ─── */}';
const faqStartStr = '{/* ─── FAQ ─── */}';
const idxReviewsStart = content.indexOf(reviewsStartStr);
const idxFaqStart = content.indexOf(faqStartStr);

if (idxReviewsStart !== -1 && idxFaqStart !== -1) {
  // Extract reviews section
  // It ends right before <GoldDivider /> which is right before FAQ
  const goldDividerStr = '<GoldDivider />';
  const idxGoldDivider = content.lastIndexOf(goldDividerStr, idxFaqStart);
  
  const reviewsBlock = content.slice(idxReviewsStart, idxGoldDivider);
  
  // Remove reviews block from original position
  content = content.slice(0, idxReviewsStart) + content.slice(idxGoldDivider);
  
  // Find where to insert it: after the Bottom CTA block.
  // The CTA block ends before the closing </div> of the main content wrapper.
  // The wrapper ends before {/* ─── Sticky Mobile Bar ─── */}
  const stickyBarStr = '{/* ─── Sticky Mobile Bar ─── */}';
  const idxStickyBar = content.indexOf(stickyBarStr);
  
  if (idxStickyBar !== -1) {
    // Insert reviewsBlock right before the closing </div> that is before stickyBarStr
    const insertPos = content.lastIndexOf('</div>', idxStickyBar);
    if (insertPos !== -1) {
      content = content.slice(0, insertPos) + '\n' + reviewsBlock + '\n' + content.slice(insertPos);
    }
  }
}

// 3. Update style block for mobile responsive grids
// Replace existing styles with improved ones.
const oldStylesStr = `        @media(max-width: 768px) {
          .pd-product-wrap { grid-template-columns: 1fr !important; gap: 28px !important; padding: 20px 16px !important; }
          .pd-story-block { grid-template-columns: 1fr !important; gap: 24px !important; }
          .pd-how-grid { grid-template-columns: 1fr 1fr !important; }
          .pd-chakra-grid { grid-template-columns: repeat(4,1fr) !important; }
          .pd-compare-section { padding: 24px 16px !important; }
          .pd-review-grid { grid-template-columns: 1fr !important; }
          .pd-bottom-cta { padding: 28px 16px !important; }
          .pd-sticky-bar { display: flex !important; }
          .pd-trust-row { grid-template-columns: repeat(2,1fr) !important; }
          .pd-ann-bar { font-size: 11px !important; }
        }`;

const newStylesStr = `        @media(max-width: 768px) {
          .pd-product-wrap { grid-template-columns: 1fr !important; gap: 28px !important; padding: 20px 16px !important; }
          .pd-story-block { grid-template-columns: 1fr !important; gap: 24px !important; }
          .pd-how-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .pd-chakra-grid { grid-template-columns: repeat(3,1fr) !important; gap: 12px !important; }
          .pd-compare-section { padding: 24px 16px !important; overflow-x: auto; }
          .pd-review-grid { grid-template-columns: 1fr !important; }
          .pd-bottom-cta { padding: 28px 16px !important; }
          .pd-sticky-bar { display: flex !important; }
          .pd-trust-row { grid-template-columns: repeat(2,1fr) !important; gap: 12px !important; }
          .pd-ann-bar { font-size: 11px !important; }
          .pd-btn-buy-big { width: 100% !important; margin-bottom: 12px !important; }
          .pd-btn-buy-big + div > button { width: 100% !important; margin-left: 0 !important; }
          table { min-width: 500px; }
        }`;

content = content.replace(oldStylesStr, newStylesStr);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated ProductDetailPage.jsx');

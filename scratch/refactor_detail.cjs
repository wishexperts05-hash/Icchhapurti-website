const fs = require('fs');

const pathDetail = 'd:/technocrate/ichhapurti/src/pages/ProductDetailPage.jsx';
let contentDetail = fs.readFileSync(pathDetail, 'utf8');

contentDetail = contentDetail.replace(/<h1 style=\{\{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 600, color: DEEP, lineHeight: 1\.1, margin: 0 \}\}>/g, '<h1 className="text-display" style={{ color: DEEP, margin: 0 }}>');
contentDetail = contentDetail.replace(/<h2 style=\{\{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: DEEP, marginBottom: 6 \}\}>/g, '<h2 className="text-h2" style={{ color: DEEP, marginBottom: 6 }}>');
contentDetail = contentDetail.replace(/<h2 style=\{\{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: GOLD_LIGHT, marginBottom: 8 \}\}>/g, '<h2 className="text-h2" style={{ color: GOLD_LIGHT, marginBottom: 8 }}>');
contentDetail = contentDetail.replace(/<span style=\{\{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: DEEP \}\}>/g, '<span className="text-price" style={{ color: DEEP }}>');
contentDetail = contentDetail.replace(/<p style=\{\{ fontSize: 16, color: MUTED, lineHeight: 1\.6 \}\}>/g, '<p className="text-body-large" style={{ color: MUTED }}>');
contentDetail = contentDetail.replace(/<p style=\{\{ color: 'rgba\(255,255,255,\.55\)', fontSize: 14, marginBottom: 28 \}\}>/g, '<p className="text-body" style={{ color: "rgba(255,255,255,.55)", marginBottom: 28 }}>');
contentDetail = contentDetail.replace(/<p style=\{\{ color: MUTED, fontSize: 14, marginBottom: 32 \}\}>/g, '<p className="text-body" style={{ color: MUTED, marginBottom: 32 }}>');
contentDetail = contentDetail.replace(/<div style=\{\{ fontSize: 11, letterSpacing: '\.1em', textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 8 \}\}>/g, '<div className="text-label" style={{ color: GOLD, marginBottom: 8 }}>');

fs.writeFileSync(pathDetail, contentDetail);

const pathReview = 'd:/technocrate/ichhapurti/src/components/Review.jsx';
let contentReview = fs.readFileSync(pathReview, 'utf8');

contentReview = contentReview.replace(/<h2 style=\{\{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: DEEP, lineHeight: 1\.1, margin: 0 \}\}>/g, '<h2 className="text-display" style={{ color: DEEP, margin: 0 }}>');
contentReview = contentReview.replace(/<div style=\{\{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, fontWeight: 600, color: DEEP, lineHeight: 1 \}\}>/g, '<div className="text-display" style={{ fontSize: 64, color: DEEP }}>');
contentReview = contentReview.replace(/<p style=\{\{ fontWeight: 700, fontSize: 15, color: INK, marginBottom: 8,[\s\S]*?fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic',[\s\S]*?\}\}>/g, '<p className="text-h3" style={{ color: INK, marginBottom: 8, fontStyle: "italic" }}>');
contentReview = contentReview.replace(/<p style=\{\{ fontSize: 14, color: INK, lineHeight: 1\.7, marginBottom: 12 \}\}>/g, '<p className="text-body" style={{ color: INK, marginBottom: 12 }}>');
contentReview = contentReview.replace(/<div style=\{\{ fontSize: 11, letterSpacing: '\.1em', textTransform: 'uppercase', color: GOLD, fontWeight: 500, marginBottom: 8 \}\}>/g, '<div className="text-label" style={{ color: GOLD, marginBottom: 8 }}>');

fs.writeFileSync(pathReview, contentReview);

console.log('Finished replacing inline styles.');

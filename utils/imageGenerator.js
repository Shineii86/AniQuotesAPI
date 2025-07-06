const { createCanvas } = require('canvas');
const { findQuoteById } = require('./helpers');

// Font setup
const registerFont = require('canvas').registerFont;
registerFont(path.join(__dirname, '../fonts/NotoSansJP-Bold.ttf'), { family: 'Noto Sans JP' });
registerFont(path.join(__dirname, '../fonts/NotoSans-Regular.ttf'), { family: 'Noto Sans' });

module.exports.generateImage = async (quoteId, lang = 'en') => {
  const quote = await findQuoteById(quoteId, lang);
  if (!quote) throw new Error('Quote not found');
  
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);
  
  // Add subtle pattern
  ctx.fillStyle = 'rgba(255, 43, 121, 0.05)';
  for (let i = 0; i < 100; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * 1200,
      Math.random() * 630,
      Math.random() * 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  
  // Quote text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  
  // Use appropriate font based on language
  const fontFamily = lang === 'jp' ? 'Noto Sans JP' : 'Noto Sans';
  ctx.font = `bold 42px "${fontFamily}"`;
  
  // Wrap text function
  const wrapText = (text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let testLine;
    let metrics;
    
    for (const word of words) {
      testLine = line + word + ' ';
      metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth) {
        ctx.fillText(line, x, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };
  
  wrapText(`"${quote.quote}"`, 600, 200, 1000, 60);
  
  // Character & Anime
  ctx.font = `italic 36px "${fontFamily}"`;
  ctx.fillText(`- ${quote.character}, ${quote.anime}`, 600, 450);
  
  // Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '20px "Noto Sans"';
  ctx.fillText('API Powered By • GitHub/Shineii86', 950, 610);
  
  // Zero Two inspired decoration
  ctx.strokeStyle = '#ff2b79';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 150);
  ctx.lineTo(300, 150);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(900, 480);
  ctx.lineTo(1100, 480);
  ctx.stroke();
  
  return canvas.toBuffer('image/png');
};

const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const { findQuoteById } = require('./helpers');

// Preload fonts at startup
GlobalFonts.registerFromPath(
  path.join(__dirname, '../fonts/NotoSansJP-Bold.ttf'), 
  'Noto Sans JP'
);
GlobalFonts.registerFromPath(
  path.join(__dirname, '../fonts/NotoSans-Regular.ttf'), 
  'Noto Sans'
);

module.exports.generateImage = async (quoteId, lang = 'en') => {
  const quote = await findQuoteById(quoteId, lang);
  if (!quote) throw new Error('Quote not found');
  
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);
  
  // Add decorative elements
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
  
  // Text styling
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  
  // Font selection
  const fontFamily = lang === 'jp' ? 'Noto Sans JP' : 'Noto Sans';
  ctx.font = `bold 42px "${fontFamily}"`;
  
  // Text wrapping function
  const wrapText = (text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, x, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };
  
  // Render quote
  wrapText(`"${quote.quote}"`, 600, 200, 1000, 60);
  
  // Render character and anime
  ctx.font = `italic 36px "${fontFamily}"`;
  ctx.fillText(`- ${quote.character}, ${quote.anime}`, 600, 450);
  
  // Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '20px "Noto Sans"';
  ctx.fillText('API Powered By • GitHub/Shineii86', 950, 610);
  
  // Decorative lines
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

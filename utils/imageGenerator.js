const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const { findQuoteById } = require('./helpers');

// Preload all required fonts at startup
try {
  // English Fonts
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/NotoSans/NotoSans-Regular.ttf'),
    'Noto Sans'
  );
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/NotoSans/NotoSans-Bold.ttf'),
    'Noto Sans Bold'
  );
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/NotoSans/NotoSans-Italic.ttf'),
    'Noto Sans Italic'
  );
  
  // Japanese Fonts
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/NotoSansJP/NotoSansJP-Regular.ttf'),
    'Noto Sans JP'
  );
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/NotoSansJP/NotoSansJP-Bold.ttf'),
    'Noto Sans JP Bold'
  );
  
  // Anime Fonts
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/Anime/AnimeAce.ttf'),
    'Anime Ace'
  );
} catch (error) {
  console.error('Font registration error:', error);
  // Fallback to system fonts if custom fonts fail
  console.warn('Using system fonts as fallback');
}

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
  
  // Determine font families
  let titleFontFamily = 'Noto Sans Bold';
  let subtitleFontFamily = 'Noto Sans Italic';
  let watermarkFontFamily = 'Noto Sans';
  
  if (lang === 'jp') {
    titleFontFamily = 'Noto Sans JP Bold';
    subtitleFontFamily = 'Noto Sans JP';
  }
  
  // Add anime theme randomly (30% chance)
  const useAnimeTheme = Math.random() > 0.7;
  if (useAnimeTheme) {
    titleFontFamily = 'Anime Ace';
    subtitleFontFamily = 'Anime Ace';
  }
  
  // Render quote
  ctx.font = `42px "${titleFontFamily}"`;
  wrapText(ctx, `"${quote.quote}"`, 600, 200, 1000, 60);
  
  // Render character and anime
  ctx.font = `italic 36px "${subtitleFontFamily}"`;
  ctx.fillText(`- ${quote.character}, ${quote.anime}`, 600, 450);
  
  // Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = `20px "${watermarkFontFamily}"`;
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

// Improved text wrapping function
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let lines = [];
  
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line !== '') {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  
  for (const [i, lineText] of lines.entries()) {
    ctx.fillText(lineText, x, y + (i * lineHeight));
  }
}

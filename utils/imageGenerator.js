const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const { findQuoteById } = require('./helpers');

// Preload all required fonts at startup
try {
  // Register Japanese fonts
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/NotoSansJP/NotoSansJP-Regular.ttf'),
    'Noto Sans JP'
  );
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/NotoSansJP/NotoSansJP-Bold.ttf'),
    'Noto Sans JP Bold'
  );
  
  // Register English fonts
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/NotoSans/NotoSans-Regular.ttf'),
    'Noto Sans'
  );
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/NotoSans/NotoSans-Bold.ttf'),
    'Noto Sans Bold'
  );
  
  // Register anime font
  GlobalFonts.registerFromPath(
    path.join(__dirname, '../fonts/Anime/AnimeAce.ttf'),
    'Anime Ace'
  );
} catch (error) {
  console.error('Font registration error:', error);
}

// Color palette from your list
const GRADIENT_COLORS = [
  ['#00A0FA', '#FF00F7'],   // ooAOFA to FFOoF7
  ['#FF0064', '#D1008C'],   // FFoo64 to D1oo8C
  ['#FF8500', '#FF0077'],   // FF85oo to FSoo77
  ['#FF9800', '#FF00F7'],   // FF98oo to FFOoF7
  ['#004895', '#E3893D'],   // 004895 to ES893D
  ['#00A0FA', '#8D00AD'],   // ooAOFA to 8DooAD
  ['#D5404A', '#FF0D37'],   // D5404A to FFoD37
  ['#FF0061', '#0082FD'],   // FFoo61 to oo82FD
  ['#BC4664', '#7B1CC6'],   // BC4664 to 7B1CC6
  ['#D1008C', '#288FA7'],   // D1oo8C to 288FA7
  ['#FF3533', '#2960E1'],   // FF3533 to 2960E1
  ['#FF452D', '#45F324'],   // FF452D to 45F324
  ['#36E869', '#3780A9'],   // 36E869 to 3780A9
  ['#42AE9A', '#FF9514'],   // 42AE9A to FF9514
  ['#FF0D37', '#FFC600']    // FFOD37 to FFC6oo
];

module.exports.generateImage = async (quoteId, lang = 'en') => {
  const quote = await findQuoteById(quoteId, lang);
  if (!quote) throw new Error('Quote not found');
  
  // Determine font families based on language
  let titleFont, subtitleFont, watermarkFont;
  
  if (lang === 'jp') {
    titleFont = '42px "Noto Sans JP Bold"';
    subtitleFont = 'italic 36px "Noto Sans JP"';
    watermarkFont = '20px "Noto Sans JP"';
  } else {
    titleFont = '42px "Noto Sans Bold"';
    subtitleFont = 'italic 36px "Noto Sans"';
    watermarkFont = '20px "Noto Sans"';
  }
  
  // Add anime theme randomly (30% chance)
  const useAnimeTheme = Math.random() > 0.7;
  if (useAnimeTheme) {
    titleFont = '46px "Anime Ace"';
    subtitleFont = '34px "Anime Ace"';
  }
  
  // Create temporary canvas for text measurement
  const tempCanvas = createCanvas(1200, 100);
  const tempCtx = tempCanvas.getContext('2d');
  
  // Set fonts for measurement
  tempCtx.font = titleFont;
  const quoteWidth = tempCtx.measureText(`"${quote.quote}"`).width;
  
  tempCtx.font = subtitleFont;
  const charWidth = tempCtx.measureText(`- ${quote.character}, ${quote.anime}`).width;
  
  // Calculate required dimensions
  const maxWidth = 1000;
  const minHeight = 630;
  const padding = 100;
  
  // Calculate number of lines needed
  tempCtx.font = titleFont;
  const lines = wrapTextForMeasurement(tempCtx, `"${quote.quote}"`, maxWidth);
  
  // Calculate canvas height
  const lineHeight = 60;
  const characterHeight = 50;
  const watermarkHeight = 30;
  const calculatedHeight = padding * 2 + 
                          (lines.length * lineHeight) + 
                          characterHeight + 
                          watermarkHeight;
  
  const height = Math.max(minHeight, calculatedHeight);
  
  // Create actual canvas with calculated dimensions
  const canvas = createCanvas(1200, height);
  const ctx = canvas.getContext('2d');
  
  // Create random gradient background
  const randomGradient = GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)];
  const gradient = ctx.createLinearGradient(0, 0, 1200, height);
  gradient.addColorStop(0, randomGradient[0]);
  gradient.addColorStop(1, randomGradient[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, height);
  
  // Add decorative elements (sakura petals for Japanese, stars for others)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  const elementCount = lang === 'jp' ? 50 : 100;
  
  for (let i = 0; i < elementCount; i++) {
    const size = Math.random() * (lang === 'jp' ? 10 : 4);
    const x = Math.random() * 1200;
    const y = Math.random() * height;
    
    if (lang === 'jp') {
      // Draw sakura petals
      drawSakuraPetals(ctx, x, y, size);
    } else {
      // Draw stars
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Text styling
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 10;
  
  // Render quote
  ctx.font = titleFont;
  const quoteY = padding + 100;
  
  if (lang === 'jp') {
    wrapJapaneseText(ctx, `"${quote.quote}"`, 600, quoteY, maxWidth, lineHeight);
  } else {
    wrapText(ctx, `"${quote.quote}"`, 600, quoteY, maxWidth, lineHeight);
  }
  
  // Render character and anime
  ctx.font = subtitleFont;
  const charY = quoteY + (lines.length * lineHeight) + 50;
  ctx.fillText(`- ${quote.character}, ${quote.anime}`, 600, charY);
  
  // Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = watermarkFont;
  ctx.shadowBlur = 5;
  ctx.fillText('© API Powered By • GitHub/Shineii86', 950, height - 30);
  
  // Decorative lines
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 0;
  
  // Top decorative line
  ctx.beginPath();
  ctx.moveTo(100, 80);
  ctx.lineTo(300, 80);
  ctx.stroke();
  
  // Bottom decorative line
  ctx.beginPath();
  ctx.moveTo(900, height - 50);
  ctx.lineTo(1100, height - 50);
  ctx.stroke();
  
  // Add anime-themed corner decorations if using anime theme
  if (useAnimeTheme) {
    ctx.strokeStyle = '#ff2b79';
    ctx.lineWidth = 4;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(100, 50);
    ctx.lineTo(50, 100);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(1150, height - 50);
    ctx.lineTo(1150, height - 100);
    ctx.lineTo(1100, height - 50);
    ctx.stroke();
  }
  
  return canvas.toBuffer('image/png');
};

// Function to draw sakura petals
function drawSakuraPetals(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  
  // Draw petal shape
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(
    size * 0.5, -size * 0.3,
    size * 0.9, size * 0.2,
    0, size
  );
  ctx.bezierCurveTo(
    -size * 0.9, size * 0.2,
    -size * 0.5, -size * 0.3,
    0, 0
  );
  
  ctx.closePath();
  ctx.fill();
  
  // Draw center circle
  ctx.beginPath();
  ctx.arc(0, size * 0.3, size * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
  ctx.fill();
  
  ctx.restore();
}

// Text measurement for height calculation
function wrapTextForMeasurement(ctx, text, maxWidth) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  
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
  
  if (line) lines.push(line);
  return lines;
}

// Text wrapping for languages with spaces
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = wrapTextForMeasurement(ctx, text, maxWidth);
  
  for (const [i, lineText] of lines.entries()) {
    ctx.fillText(lineText, x, y + (i * lineHeight));
  }
}

// Special text wrapping for Japanese (character-based)
function wrapJapaneseText(ctx, text, x, y, maxWidth, lineHeight) {
  const characters = text.split('');
  let line = '';
  const lines = [];
  
  for (const char of characters) {
    const testLine = line + char;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && line !== '') {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  }
  
  if (line) lines.push(line);
  
  for (const [i, lineText] of lines.entries()) {
    ctx.fillText(lineText, x, y + (i * lineHeight));
  }
}

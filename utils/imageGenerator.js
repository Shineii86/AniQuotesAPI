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

// Updated color palette
const GRADIENT_COLORS = [
  ['#FF2B79', '#9B30FF'],   // Pink to Purple
  ['#00A0FA', '#FF00F7'],   // Blue to Pink
  ['#FF0064', '#D1008C'],   // Deep Pink to Magenta
  ['#FF8500', '#FF0077'],   // Orange to Pink
  ['#004895', '#E3893D'],   // Navy to Gold
  ['#00A0FA', '#8D00AD'],   // Blue to Purple
  ['#D5404A', '#FF0D37'],   // Crimson to Red
  ['#FF0061', '#0082FD'],   // Pink to Blue
  ['#BC4664', '#7B1CC6'],   // Maroon to Purple
  ['#D1008C', '#288FA7'],   // Magenta to Teal
  ['#FF3533', '#2960E1'],   // Red to Blue
  ['#FF452D', '#45F324'],   // Orange to Green
  ['#36E869', '#3780A9'],   // Green to Blue
  ['#42AE9A', '#FF9514'],   // Teal to Orange
  ['#FF0D37', '#FFC600']    // Red to Yellow
];

module.exports.generateImageFromQuote = async (quote, lang = 'en') => {
  // Determine font families based on language
  let titleFont, subtitleFont;
  const titleSize = 42;
  const subtitleSize = 32;
  const watermarkSize = 16;
  
  if (lang === 'jp') {
    titleFont = `bold ${titleSize}px "Noto Sans JP Bold"`;
    subtitleFont = `italic ${subtitleSize}px "Noto Sans JP"`;
  } else {
    titleFont = `bold ${titleSize}px "Noto Sans Bold"`;
    subtitleFont = `italic ${subtitleSize}px "Noto Sans"`;
  }
  
  // Add anime theme randomly (30% chance)
  const useAnimeTheme = Math.random() > 0.7;
  if (useAnimeTheme) {
    titleFont = `${titleSize + 4}px "Anime Ace"`;
    subtitleFont = `${subtitleSize - 2}px "Anime Ace"`;
  }
  
  // Create temporary canvas for text measurement
  const tempCanvas = createCanvas(1200, 100);
  const tempCtx = tempCanvas.getContext('2d');
  
  // Set fonts for measurement
  tempCtx.font = titleFont;
  const quoteWidth = tempCtx.measureText(`"${quote.quote}"`).width;
  
  tempCtx.font = subtitleFont;
  const attribution = `- ${quote.character}, ${quote.anime}`;
  const attributionWidth = tempCtx.measureText(attribution).width;
  
  // Calculate required dimensions
  const maxWidth = 1000;
  const minHeight = 630;
  const padding = 100;
  const verticalSpacing = 70;
  
  // Calculate number of lines needed
  tempCtx.font = titleFont;
  const lines = wrapTextForMeasurement(tempCtx, `"${quote.quote}"`, maxWidth);
  
  // Calculate canvas height
  const lineHeight = 60;
  const calculatedHeight = padding * 2 + 
                          (lines.length * lineHeight) + 
                          verticalSpacing;
  
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
  
  // Add decorative elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  const elementCount = lang === 'jp' ? 50 : 100;
  
  for (let i = 0; i < elementCount; i++) {
    const size = Math.random() * (lang === 'jp' ? 10 : 4);
    const x = Math.random() * 1200;
    const y = Math.random() * height;
    
    if (lang === 'jp') {
      drawSakuraPetals(ctx, x, y, size);
    } else {
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
  const quoteY = padding + 80;
  
  if (lang === 'jp') {
    wrapJapaneseText(ctx, `"${quote.quote}"`, 600, quoteY, maxWidth, lineHeight);
  } else {
    wrapText(ctx, `"${quote.quote}"`, 600, quoteY, maxWidth, lineHeight);
  }
  
  // Render character and anime
  ctx.font = subtitleFont;
  const charY = quoteY + (lines.length * lineHeight) + 60;
  ctx.fillText(attribution, 600, charY);
  
  // API Watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = `${watermarkSize}px "Noto Sans"`;
  ctx.shadowBlur = 5;
  
  // Create watermark background
  const watermarkText = 'API Powered By • GitHub/Shineii86';
  const watermarkWidth = ctx.measureText(watermarkText).width + 30;
  const watermarkHeight = 35;
  const watermarkX = 1200 - watermarkWidth + 20;
  const watermarkY = height - 35;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.roundRect(watermarkX - 10, watermarkY - watermarkHeight + 15, 
               watermarkWidth, watermarkHeight, 5);
  ctx.fill();
  
  // Watermark text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(watermarkText, watermarkX + watermarkWidth/2 - 20, watermarkY);
  
  // Decorative elements
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 0;
  
  // Top decorative line
  ctx.beginPath();
  ctx.moveTo(100, 80);
  ctx.lineTo(250, 80);
  ctx.stroke();
  
  // Bottom decorative line
  ctx.beginPath();
  ctx.moveTo(950, height - 50);
  ctx.lineTo(1100, height - 50);
  ctx.stroke();
  
  // Anime-themed corner decorations
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

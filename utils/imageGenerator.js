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
  
  console.log('Fonts registered successfully');
} catch (error) {
  console.error('Font registration error:', error.message);
  console.error('Stack trace:', error.stack);
}

// Color palette with Zero Two inspired colors
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

// Main image generation function
module.exports.generateImage = async (quoteId, lang = 'en') => {
  try {
    console.log(`Generating image for quote ID: ${quoteId}, language: ${lang}`);
    const quote = await findQuoteById(quoteId, lang);
    
    if (!quote) {
      console.error(`Quote not found for ID: ${quoteId}, lang: ${lang}`);
      throw new Error('Quote not found');
    }
    
    console.log(`Using quote: ${quote.quote.substring(0, 30)}...`);
    
    // Set font sizes based on language
    const titleSize = lang === 'jp' ? 40 : 42;
    const subtitleSize = lang === 'jp' ? 32 : 34;
    const watermarkSize = 16;
    
    // Determine font families
    let titleFont, subtitleFont;
    
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
      console.log('Using anime theme');
      titleFont = `${titleSize + 4}px "Anime Ace"`;
      subtitleFont = `${subtitleSize - 2}px "Anime Ace"`;
    }
    
    // Create temporary canvas for text measurement
    const tempCanvas = createCanvas(1, 1);
    const tempCtx = tempCanvas.getContext('2d');
    
    // Measure quote text
    tempCtx.font = titleFont;
    const quoteMetrics = wrapTextForMeasurement(tempCtx, `"${quote.quote}"`, 1000);
    const lineCount = quoteMetrics.lines.length;
    
    // Measure attribution text
    const attribution = `- ${quote.character}, ${quote.anime}`;
    tempCtx.font = subtitleFont;
    const attributionWidth = tempCtx.measureText(attribution).width;
    
    // Calculate canvas dimensions
    const minHeight = 630;
    const padding = 80;
    const lineHeight = 60;
    const attributionSpacing = 50;
    const watermarkHeight = 40;
    
    const calculatedHeight = padding * 2 + 
                           (lineCount * lineHeight) + 
                           attributionSpacing + 
                           watermarkHeight;
    
    const height = Math.max(minHeight, calculatedHeight);
    const width = 1200;
    
    console.log(`Creating canvas: ${width}x${height}px`);
    
    // Create main canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradientIndex = Math.floor(Math.random() * GRADIENT_COLORS.length);
    const gradientColors = GRADIENT_COLORS[gradientIndex];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    console.log(`Applied gradient: ${gradientColors[0]} to ${gradientColors[1]}`);
    
    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    const elementCount = lang === 'jp' ? 50 : 100;
    
    for (let i = 0; i < elementCount; i++) {
      const size = Math.random() * (lang === 'jp' ? 10 : 4);
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      if (lang === 'jp') {
        drawSakuraPetals(ctx, x, y, size);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Set text styles
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 10;
    
    // Render quote text
    ctx.font = titleFont;
    const quoteY = padding;
    
    if (lang === 'jp') {
      wrapJapaneseText(ctx, `"${quote.quote}"`, width / 2, quoteY, 1000, lineHeight);
    } else {
      wrapText(ctx, `"${quote.quote}"`, width / 2, quoteY, 1000, lineHeight);
    }
    
    // Render attribution
    ctx.font = subtitleFont;
    const attributionY = quoteY + (lineCount * lineHeight) + attributionSpacing;
    ctx.fillText(attribution, width / 2, attributionY);
    
    // Render watermark
    ctx.shadowBlur = 0;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    
    const watermarkText = 'API Powered By • GitHub/Shineii86';
    ctx.font = `bold ${watermarkSize}px "Noto Sans"`;
    
    // Calculate watermark position
    const watermarkPadding = 20;
    const watermarkX = width - watermarkPadding;
    const watermarkY = height - watermarkPadding;
    
    // Draw watermark background
    const watermarkWidth = ctx.measureText(watermarkText).width + 30;
    const watermarkHeightRect = 30;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect(
      width - watermarkWidth - watermarkPadding,
      height - watermarkHeightRect - watermarkPadding + 5,
      watermarkWidth,
      watermarkHeightRect,
      5
    );
    ctx.fill();
    
    // Draw watermark text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(watermarkText, watermarkX, watermarkY);
    
    // Draw decorative elements
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    // Top left decoration
    ctx.beginPath();
    ctx.moveTo(padding, padding - 30);
    ctx.lineTo(padding + 100, padding - 30);
    ctx.stroke();
    
    // Bottom right decoration
    ctx.beginPath();
    ctx.moveTo(width - padding - 100, height - padding + 30);
    ctx.lineTo(width - padding, height - padding + 30);
    ctx.stroke();
    
    console.log('Image generated successfully');
    return canvas.toBuffer('image/png');
    
  } catch (error) {
    console.error('Image generation error:', error.message);
    console.error('Stack trace:', error.stack);
    throw new Error('Image generation failed: ' + error.message);
  }
};

// Helper functions

function drawSakuraPetals(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  
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
  
  // Draw center
  ctx.beginPath();
  ctx.arc(0, size * 0.3, size * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
  ctx.fill();
  
  ctx.restore();
}

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
  
  return {
    lines,
    width: ctx.measureText(lines[0] || '').width,
    height: lines.length * parseInt(ctx.font)
  };
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const measurement = wrapTextForMeasurement(ctx, text, maxWidth);
  
  for (const [i, line] of measurement.lines.entries()) {
    ctx.fillText(line, x, y + (i * lineHeight));
  }
}

function wrapJapaneseText(ctx, text, x, y, maxWidth, lineHeight) {
  const characters = Array.from(text);
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

// Add roundRect support if not available
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
  };
}

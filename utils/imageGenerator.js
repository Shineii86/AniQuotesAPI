// Anime Quote Image Generator - Multi-language
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const { findQuoteById } = require('./helpers');

// Register custom fonts
try {
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/NotoSansJP/NotoSansJP-Regular.ttf'), 'Noto Sans JP');
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/NotoSansJP/NotoSansJP-Bold.ttf'), 'Noto Sans JP Bold');
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/NotoSans/NotoSans-Regular.ttf'), 'Noto Sans');
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/NotoSans/NotoSans-Bold.ttf'), 'Noto Sans Bold');
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/Anime/AnimeAce.ttf'), 'Anime Ace');
  console.log('Fonts loaded successfully.');
} catch (err) {
  console.error('Font loading error:', err.message);
}

const GRADIENT_COLORS = [
  ['#FF2B79', '#9B30FF'], ['#00A0FA', '#FF00F7'], ['#FF0064', '#D1008C'],
  ['#FF8500', '#FF0077'], ['#004895', '#E3893D'], ['#00A0FA', '#8D00AD'],
  ['#D5404A', '#FF0D37'], ['#FF0061', '#0082FD'], ['#BC4664', '#7B1CC6'],
  ['#D1008C', '#288FA7'], ['#FF3533', '#2960E1'], ['#FF452D', '#45F324'],
  ['#36E869', '#3780A9'], ['#42AE9A', '#FF9514'], ['#FF0D37', '#FFC600']
];

module.exports.generateImage = async (quoteId, lang = 'en') => {
  try {
    const quote = await findQuoteById(quoteId, lang);
    if (!quote) throw new Error('Quote not found');

    const canvasWidth = 1200;
    const padding = 100;
    const lineHeight = 64;
    const attributionGap = 60;
    const watermarkGap = 50;

    const baseFontSize = 40;
    const attributionFontSize = 32;
    const watermarkFontSize = 18;

    const isJapanese = lang === 'jp';

    let fontQuote = `bold ${baseFontSize}px "${isJapanese ? 'Noto Sans JP Bold' : 'Noto Sans Bold'}"`;
    let fontAttribution = `italic ${attributionFontSize}px "${isJapanese ? 'Noto Sans JP' : 'Noto Sans'}"`;

    if (Math.random() > 0.7) {
      fontQuote = `${baseFontSize + 4}px "Anime Ace"`;
      fontAttribution = `${attributionFontSize}px "Anime Ace"`;
    }

    const tempCanvas = createCanvas(1, 1);
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = fontQuote;

    const quoteText = `"${quote.quote}"`;
    const { lines } = isJapanese
      ? wrapJapaneseTextForMeasurement(tempCtx, quoteText, canvasWidth - padding * 2)
      : wrapTextForMeasurement(tempCtx, quoteText, canvasWidth - padding * 2);

    const textBlockHeight = lines.length * lineHeight;
    const canvasHeight = padding + textBlockHeight + attributionGap + watermarkGap + padding;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    const gradientColors = GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)];
    const bgGradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    bgGradient.addColorStop(0, gradientColors[0]);
    bgGradient.addColorStop(1, gradientColors[1]);

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.font = fontQuote;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;

    const drawTextFunc = isJapanese ? wrapJapaneseText : wrapText;
    drawTextFunc(ctx, quoteText, canvasWidth / 2, padding, canvasWidth - padding * 2, lineHeight);

    ctx.font = fontAttribution;
    ctx.shadowBlur = 5;
    const attributionText = `– ${quote.character}, ${quote.anime}`;
    ctx.fillText(attributionText, canvasWidth / 2, padding + textBlockHeight + attributionGap);

    // Redesigned watermark
    ctx.font = `600 ${watermarkFontSize}px "Noto Sans"`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 2;
    ctx.fillText('API Source: GitHub/AniQuotes', canvasWidth - 24, canvasHeight - 24);

    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Image generation error:', error.message);
    throw new Error('Image generation failed');
  }
};

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
  return { lines };
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const { lines } = wrapTextForMeasurement(ctx, text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
}

function wrapJapaneseTextForMeasurement(ctx, text, maxWidth) {
  const chars = Array.from(text);
  let line = '';
  const lines = [];
  for (const char of chars) {
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
  return { lines };
}

function wrapJapaneseText(ctx, text, x, y, maxWidth, lineHeight) {
  const { lines } = wrapJapaneseTextForMeasurement(ctx, text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
}

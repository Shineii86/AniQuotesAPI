// Anime Quote Image Generator — v2
// Upgraded: rounded card style, glow effects, auto-sizing, watermark bar
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const { findQuoteById } = require('./helpers');

// Register custom fonts
try {
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/NotoSansJP/NotoSansJP-Regular.ttf'), 'Noto Sans JP');
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/NotoSansJP/NotoSansJP-Bold.ttf'), 'Noto Sans JP Bold');
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/NotoSans/NotoSans-Regular.ttf'), 'Noto Sans');
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/NotoSans/NotoSans-Bold.ttf'), 'Noto Sans Bold');
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/NotoSans/NotoSans-Italic.ttf'), 'Noto Sans Italic');
  GlobalFonts.registerFromPath(path.join(__dirname, '../fonts/Anime/AnimeAce.ttf'), 'Anime Ace');
} catch (err) {
  console.error('Font loading error:', err.message);
}

// Curated gradient pairs — warm, vibrant, anime-inspired
const GRADIENTS = [
  ['#FF2B79', '#9B30FF'], ['#00A0FA', '#FF00F7'], ['#FF0064', '#D1008C'],
  ['#FF8500', '#FF0077'], ['#004895', '#E3893D'], ['#00A0FA', '#8D00AD'],
  ['#D5404A', '#FF0D37'], ['#FF0061', '#0082FD'], ['#BC4664', '#7B1CC6'],
  ['#D1008C', '#288FA7'], ['#FF3533', '#2960E1'], ['#FF452D', '#45F324'],
  ['#36E869', '#3780A9'], ['#42AE9A', '#FF9514'], ['#FF0D37', '#FFC600'],
  ['#6366f1', '#ec4899'], ['#8b5cf6', '#06b6d4'], ['#f43f5e', '#f59e0b'],
];

// ── Helpers ──

function pickGradient() {
  return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapTextForMeasurement(ctx, text, maxWidth) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function wrapJapaneseTextForMeasurement(ctx, text, maxWidth) {
  const chars = Array.from(text);
  let line = '';
  const lines = [];
  for (const char of chars) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      lines.push(line);
      line = char;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, isJapanese) {
  const lines = isJapanese
    ? wrapJapaneseTextForMeasurement(ctx, text, maxWidth)
    : wrapTextForMeasurement(ctx, text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
  return lines.length;
}

// ── Auto font size — shrink for long quotes ──

function pickFontSize(quote, lang) {
  const len = quote.length;
  if (lang === 'jp' || lang === 'ja') {
    if (len > 120) return 30;
    if (len > 80) return 34;
    return 40;
  }
  if (len > 200) return 28;
  if (len > 140) return 32;
  if (len > 100) return 36;
  return 40;
}

// ── Main generator ──

/**
 * Generate an image for a quote object
 * @param {Object} quote - { quote, anime, character, language }
 * @returns {Buffer} PNG image buffer
 */
async function generateImageFromQuote(quote) {
  const W = 1200;
  const PAD = 80;
  const CARD_R = 24;
  const CARD_PAD = 60;
  const WATERMARK_H = 52;

  const lang = quote.language || 'en';
  const isJapanese = lang === 'jp' || lang === 'ja';

  // Auto-size font
  const baseFontSize = pickFontSize(quote.quote, lang);
  const attrFontSize = Math.round(baseFontSize * 0.75);
  const wmFontSize = 16;

  // Pick random style
  const useAnimeFont = Math.random() > 0.65;
  const fontQuote = useAnimeFont
    ? `${baseFontSize + 4}px "Anime Ace"`
    : `bold ${baseFontSize}px "${isJapanese ? 'Noto Sans JP Bold' : 'Noto Sans Bold'}"`;
  const fontAttr = useAnimeFont
    ? `${attrFontSize}px "Anime Ace"`
    : `italic ${attrFontSize}px "${isJapanese ? 'Noto Sans JP' : 'Noto Sans Italic'}"`;

  // Measure text to determine canvas height
  const measureCanvas = createCanvas(1, 1);
  const measureCtx = measureCanvas.getContext('2d');
  measureCtx.font = fontQuote;

  const quoteText = `\u201C${quote.quote}\u201D`;
  const maxTextW = W - PAD * 2 - CARD_PAD * 2;
  const lineH = Math.round(baseFontSize * 1.6);

  const lines = isJapanese
    ? wrapJapaneseTextForMeasurement(measureCtx, quoteText, maxTextW)
    : wrapTextForMeasurement(measureCtx, quoteText, maxTextW);

  const textBlockH = lines.length * lineH;
  const H = PAD + CARD_PAD + textBlockH + 40 + attrFontSize + 24 + CARD_PAD + WATERMARK_H + PAD;

  // Create canvas
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ── Background gradient ──
  const [c1, c2] = pickGradient();
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, c1);
  bgGrad.addColorStop(1, c2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Subtle noise overlay ──
  ctx.globalAlpha = 0.03;
  for (let i = 0; i < 3000; i++) {
    const nx = Math.random() * W;
    const ny = Math.random() * H;
    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
    ctx.fillRect(nx, ny, 1, 1);
  }
  ctx.globalAlpha = 1;

  // ── Glass card ──
  const cardX = PAD;
  const cardY = PAD;
  const cardW = W - PAD * 2;
  const cardH = H - PAD * 2 - WATERMARK_H;

  // Card shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 10;
  roundRect(ctx, cardX, cardY, cardW, cardH, CARD_R);
  ctx.fillStyle = 'rgba(10, 10, 20, 0.55)';
  ctx.fill();
  ctx.restore();

  // Card border glow
  roundRect(ctx, cardX, cardY, cardW, cardH, CARD_R);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ── Quote mark decoration ──
  ctx.font = `bold 120px "Noto Sans"`;
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('\u201C', cardX + 20, cardY + 10);

  // ── Quote text ──
  ctx.font = fontQuote;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 6;

  const textX = W / 2;
  const textY = cardY + CARD_PAD + 10;
  drawWrappedText(ctx, quoteText, textX, textY, maxTextW, lineH, isJapanese);

  // ── Attribution ──
  ctx.shadowBlur = 3;
  ctx.font = fontAttr;
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  const attrY = textY + lines.length * lineH + 30;
  const attrText = `\u2014 ${quote.character}, ${quote.anime}`;
  ctx.fillText(attrText, textX, attrY);

  ctx.shadowBlur = 0;

  // ── Watermark bar ──
  const wmY = H - WATERMARK_H - PAD;
  // Bar background
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  roundRect(ctx, cardX, wmY, cardW, WATERMARK_H, CARD_R);
  ctx.fill();

  // Watermark text
  ctx.font = `600 ${wmFontSize}px "Noto Sans"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('AniQuotes API  ·  github.com/Shineii86/AniQuotesAPI', W / 2, wmY + WATERMARK_H / 2);

  return canvas.toBuffer('image/png');
}

/**
 * Generate image by quote ID (legacy — local data only)
 */
async function generateImage(quoteId, lang = 'en') {
  const quote = await findQuoteById(quoteId, lang);
  if (!quote) throw new Error('Quote not found');
  return generateImageFromQuote(quote);
}

module.exports = { generateImage, generateImageFromQuote };

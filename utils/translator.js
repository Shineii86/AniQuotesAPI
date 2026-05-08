/**
 * Auto-Translation Service
 * Uses LibreTranslate (free, open-source) for on-demand translation.
 *
 * Public instance: https://libretranslate.com (rate-limited)
 * Self-hosted: https://github.com/LibreTranslate/LibreTranslate
 *
 * Set LIBRETRANSLATE_URL env var to use a custom instance.
 * Set LIBRETRANSLATE_API_KEY if your instance requires auth.
 */
const { cache } = require('./cache');

const DEFAULT_URL = 'https://libretranslate.com';
const BASE_URL = process.env.LIBRETRANSLATE_URL || DEFAULT_URL;
const API_KEY = process.env.LIBRETRANSLATE_API_KEY || '';

// Cache translations for 24 hours
const TRANSLATION_CACHE_TTL = 24 * 60 * 60 * 1000;

// LibreTranslate language code mapping
const LANG_MAP = {
  en: 'en',
  jp: 'ja',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh',
  hi: 'hi',
  es: 'es',
  fr: 'fr',
  de: 'de',
  pt: 'pt',
  ru: 'ru',
  it: 'it'
};

/**
 * Translate text to target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code
 * @param {string} [sourceLang='en'] - Source language code
 * @returns {Promise<string|null>} Translated text or null on failure
 */
async function translate(text, targetLang, sourceLang = 'en') {
  const target = LANG_MAP[targetLang] || targetLang;
  const source = LANG_MAP[sourceLang] || sourceLang;

  if (source === target) return text;

  const cacheKey = `translate:${source}:${target}:${hashText(text)}`;
  return cache.getOrCompute(cacheKey, async () => {
    try {
      const body = {
        q: text,
        source,
        target,
        format: 'text'
      };
      if (API_KEY) body.api_key = API_KEY;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);

      try {
        const res = await fetch(`${BASE_URL}/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal
        });

        if (!res.ok) {
          const errBody = await res.text();
          console.error(`[Translator] HTTP ${res.status}: ${errBody}`);
          return null;
        }

        const data = await res.json();
        return data.translatedText || null;
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      console.error(`[Translator] Translation failed (${source}→${target}):`, err.message);
      return null;
    }
  }, TRANSLATION_CACHE_TTL);
}

/**
 * Translate a full quote object
 * @param {Object} quote - Quote in AniQuotes format
 * @param {string} targetLang - Target language code
 * @returns {Promise<Object>} Translated quote object
 */
async function translateQuote(quote, targetLang) {
  const translatedText = await translate(quote.quote, targetLang, quote.language || 'en');

  if (!translatedText) return null;

  return {
    ...quote,
    quote: translatedText,
    language: targetLang,
    translatedFrom: quote.language || 'en',
    translatedBy: 'LibreTranslate'
  };
}

/**
 * Simple text hash for cache keys
 */
function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Check if a language code is supported
 * @param {string} lang
 * @returns {boolean}
 */
function isSupportedLanguage(lang) {
  return lang in LANG_MAP;
}

module.exports = { translate, translateQuote, isSupportedLanguage, LANG_MAP };

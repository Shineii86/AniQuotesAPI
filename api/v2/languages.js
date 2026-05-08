const { getRandom, getByAnime, getByCharacter } = require('../../utils/providers');
const { readLanguageQuotes, filterQuotes, getRandomItems, paginate } = require('../../utils/helpers');
const { translateQuote, isSupportedLanguage } = require('../../utils/translator');
const { handleError } = require('../../utils/errors');
const { buildMeta } = require('../../utils/config');

module.exports = async (req, res) => {
  const { lang, anime, character, limit, offset } = req.query;

  if (!lang) {
    return handleError(res, 400, "Missing 'lang' query parameter");
  }

  if (!isSupportedLanguage(lang)) {
    return handleError(res, 400, `Unsupported language: "${lang}". Supported: en, jp, ko, zh, hi, es, fr, de, pt, ru, it`);
  }

  try {
    const lim = Math.min(parseInt(limit, 10) || 3, 20);
    const off = parseInt(offset, 10) || 0;

    // If requesting English, use existing local data directly
    if (lang === 'en') {
      let quotes = readLanguageQuotes('en');
      if (anime) quotes = filterQuotes(quotes, 'anime', anime);
      if (character) quotes = filterQuotes(quotes, 'character', character);

      if (!quotes.length) {
        return handleError(res, 404, "No quotes found for the given parameters");
      }

      const randomQuotes = getRandomItems(quotes, lim);
      const page = paginate(randomQuotes, 0, lim);

      res.setHeader('Cache-Control', 'public, max-age=300');

      return res.status(200).json({
        status: "success",
        data: {
          quotes: page.items,
          pagination: {
            total: quotes.length,
            limit: lim,
            offset: off,
            hasMore: page.hasMore
          }
        },
        meta: buildMeta({
          language: lang,
          translated: false,
          filters: { anime: anime || null, character: character || null }
        })
      });
    }

    // For non-English: check if we have pre-translated local data first
    let localQuotes = readLanguageQuotes(lang);
    if (anime) localQuotes = filterQuotes(localQuotes, 'anime', anime);
    if (character) localQuotes = filterQuotes(localQuotes, 'character', character);

    // If we have enough local translations, use them
    if (localQuotes.length >= lim) {
      const randomQuotes = getRandomItems(localQuotes, lim);
      const page = paginate(randomQuotes, 0, lim);

      res.setHeader('Cache-Control', 'public, max-age=300');

      return res.status(200).json({
        status: "success",
        data: {
          quotes: page.items,
          pagination: {
            total: localQuotes.length,
            limit: lim,
            offset: off,
            hasMore: page.hasMore
          }
        },
        meta: buildMeta({
          language: lang,
          translated: false,
          source: 'local',
          filters: { anime: anime || null, character: character || null }
        })
      });
    }

    // Not enough local translations — fetch English quotes and auto-translate
    let englishQuotes;
    if (anime) {
      const result = await getByAnime(anime, lim);
      englishQuotes = result.quotes;
    } else if (character) {
      const result = await getByCharacter(character, lim);
      englishQuotes = result.quotes;
    } else {
      // Random quotes
      const promises = Array.from({ length: lim }, () => getRandom());
      englishQuotes = (await Promise.all(promises)).filter(Boolean);
    }

    if (!englishQuotes.length) {
      return handleError(res, 404, "No quotes found to translate");
    }

    // Auto-translate each quote
    const translationPromises = englishQuotes.map(q => translateQuote(q, lang));
    const translated = (await Promise.all(translationPromises)).filter(Boolean);

    if (!translated.length) {
      return handleError(res, 502, "Translation service unavailable. Try again later or request English quotes.");
    }

    res.setHeader('Cache-Control', 'public, max-age=3600');

    res.status(200).json({
      status: "success",
      data: {
        quotes: translated,
        pagination: {
          total: translated.length,
          limit: lim,
          offset: off,
          hasMore: false
        }
      },
      meta: buildMeta({
        language: lang,
        translated: true,
        translatedFrom: 'en',
        translatedBy: 'LibreTranslate',
        filters: { anime: anime || null, character: character || null }
      })
    });
  } catch (error) {
    console.error('Error in language quotes handler:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

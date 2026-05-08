const { readLanguageQuotes, filterQuotes, getRandomItems, paginate } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');
const { buildMeta } = require('../../utils/config');

module.exports = (req, res) => {
  const { lang, anime, character, limit, offset } = req.query;

  if (!lang) {
    return handleError(res, 400, "Missing 'lang' query parameter");
  }

  try {
    let quotes = readLanguageQuotes(lang);

    // Optional filters
    if (anime) {
      quotes = filterQuotes(quotes, 'anime', anime);
    }
    if (character) {
      quotes = filterQuotes(quotes, 'character', character);
    }

    if (!quotes.length) {
      return handleError(res, 404, "No quotes found for the given parameters");
    }

    const lim = Math.min(parseInt(limit, 10) || 3, 20);
    const off = parseInt(offset, 10) || 0;
    const randomQuotes = getRandomItems(quotes, lim);
    const page = paginate(randomQuotes, 0, lim);

    res.status(200).json({
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
        filters: {
          anime: anime || null,
          character: character || null
        }
      })
    });
  } catch (error) {
    console.error('Error in language quotes handler:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

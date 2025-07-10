const { readLanguageQuotes, filterQuotes } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');

module.exports = (req, res) => {
  const { lang, anime, character } = req.query;

  if (!lang) {
    return handleError(res, 400, "Missing 'lang' query parameter");
  }

  try {
    let quotes = readLanguageQuotes(lang);

    // Apply optional filters
    if (anime) {
      quotes = filterQuotes(quotes, 'anime', anime);
    }
    if (character) {
      quotes = filterQuotes(quotes, 'character', character);
    }

    if (!quotes.length) {
      return handleError(res, 404, "No quotes found for the given parameters");
    }

    res.status(200).json({
      status: "success",
      data: {
        quotes,
        pagination: {
          total: quotes.length
        }
      },
      meta: {
        language: lang,
        filters: {
          anime: anime || null,
          character: character || null
        },
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegram.me/Shineii86",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in language quotes handler:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

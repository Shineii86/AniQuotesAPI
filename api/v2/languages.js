const { readLanguageQuotes, filterQuotes } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');

// Random Quotes
const QuoteCount = 3;

// Helper: Get N random elements from array
function getRandomQuotes(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

module.exports = (req, res) => {
  const { lang, anime, character } = req.query;

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

    res.status(200).json({
      status: "success",
      data: {
        quotes: getRandomQuotes(quotes, QuoteCount),
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
        message: "Build with ❤️ by Shinei Nouzen",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in language quotes handler:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

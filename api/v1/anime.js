const { readMasterQuotes, filterQuotes } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');

function getRandomQuotes(arr, count) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

module.exports = (req, res) => {
  const { name } = req.query;

  if (!name) {
    return handleError(res, 400, "Missing 'name' query parameter");
  }

  try {
    const allQuotes = readMasterQuotes();
    const filteredQuotes = filterQuotes(allQuotes, 'anime', name);

    if (filteredQuotes.length === 0) {
      return handleError(res, 404, `No quotes found for anime: "${name}"`);
    }

    res.status(200).json({
      status: "success",
      data: {
        quotes: getRandomQuotes(filteredQuotes, 3),
        pagination: {
          total: filteredQuotes.length
        }
      },
      meta: {
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegram.me/Shineii86",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in fetching quotes:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

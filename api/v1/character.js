const { readMasterQuotes, filterQuotes } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');

module.exports = (req, res) => {
  const { name } = req.query;

  if (!name) {
    return handleError(res, 400, "Missing 'name' query parameter");
  }

  try {
    const allQuotes = readMasterQuotes();
    const filteredQuotes = filterQuotes(allQuotes, 'character', name);

    if (filteredQuotes.length === 0) {
      return handleError(res, 404, `No quotes found for character: "${name}"`);
    }

    res.status(200).json({
      status: "success",
      data: {
        quotes: filteredQuotes,
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
    console.error('Error in character quotes handler:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

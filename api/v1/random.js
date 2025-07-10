const { readMasterQuotes, getRandomQuote } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');

module.exports = (req, res) => {
  try {
    const quotes = readMasterQuotes();
    const randomQuote = getRandomQuote(quotes);

    res.status(200).json({
      status: "success",
      data: randomQuote,
      meta: {
        creator: "Shinei Nouzen",
        github: "https://github.com/Shineii86",
        telegram: "https://telegran.me/Shineii86",
        message: "Build with ❤️ by Shinei Nouzen",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching random quote:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

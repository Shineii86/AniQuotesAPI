const { readMasterQuotes, getRandomQuote } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');

module.exports = (req, res) => {
  try {
    const quotes = readMasterQuotes();
    const randomQuote = getRandomQuote(quotes);
    
    res.json({
      ...randomQuote,
      credit: "GitHub/Shineii86"
    });
  } catch (error) {
    handleError(res, 500, 'Internal Server Error');
  }
};

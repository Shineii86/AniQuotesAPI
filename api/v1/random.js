const { readMasterQuotes, getRandomQuote } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');
const { buildMeta } = require('../../utils/config');

module.exports = (req, res) => {
  try {
    const quotes = readMasterQuotes();
    const randomQuote = getRandomQuote(quotes);

    res.status(200).json({
      status: "success",
      data: randomQuote,
      meta: buildMeta()
    });
  } catch (error) {
    console.error('Error fetching random quote:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

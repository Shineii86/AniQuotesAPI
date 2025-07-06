const { readMasterQuotes, filterQuotes } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');

module.exports = (req, res) => {
  const { name } = req.query;
  
  if (!name) return handleError(res, 400, "Missing 'name' parameter");
  
  try {
    let quotes = readMasterQuotes();
    quotes = filterQuotes(quotes, 'anime', name);
    
    if (quotes.length === 0) {
      return handleError(res, 404, "No quotes found for this anime");
    }
    
    res.json({
      quotes,
      count: quotes.length,
      credit: "GitHub/Shineii86"
    });
  } catch (error) {
    handleError(res, 500, 'Internal Server Error');
  }
};

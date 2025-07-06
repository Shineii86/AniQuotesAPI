const { readLanguageQuotes, filterQuotes } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');

module.exports = (req, res) => {
  const { lang, anime, character } = req.query;
  
  if (!lang) return handleError(res, 400, "Missing 'lang' parameter");
  
  try {
    let quotes = readLanguageQuotes(lang);
    
    // Apply filters
    quotes = filterQuotes(quotes, 'anime', anime);
    quotes = filterQuotes(quotes, 'character', character);
    
    if (quotes.length === 0) {
      return handleError(res, 404, "No quotes found");
    }
    
    res.json({
      quotes,
      count: quotes.length,
      language: lang,
      credit: "GitHub/Shineii86"
    });
  } catch (error) {
    handleError(res, 500, 'Internal Server Error');
  }
};

const { readMasterQuotes, searchQuotes, getRandomItems, paginate } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');
const { buildMeta } = require('../../utils/config');

module.exports = (req, res) => {
  const { q, limit, offset } = req.query;

  if (!q) {
    return handleError(res, 400, "Missing 'q' (search query) parameter");
  }

  try {
    const allQuotes = readMasterQuotes();
    const results = searchQuotes(allQuotes, q);

    if (results.length === 0) {
      return handleError(res, 404, `No quotes found matching: "${q}"`);
    }

    const lim = Math.min(parseInt(limit, 10) || 5, 20);
    const off = parseInt(offset, 10) || 0;
    const page = paginate(results, off, lim);

    res.status(200).json({
      status: "success",
      data: {
        query: q,
        quotes: page.items,
        pagination: {
          total: results.length,
          limit: lim,
          offset: off,
          hasMore: page.hasMore
        }
      },
      meta: buildMeta()
    });
  } catch (error) {
    console.error('Error in search handler:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

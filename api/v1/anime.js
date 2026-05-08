const { readMasterQuotes, filterQuotes, getRandomItems, paginate } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');
const { buildMeta } = require('../../utils/config');

module.exports = (req, res) => {
  const { name, limit, offset } = req.query;

  if (!name) {
    return handleError(res, 400, "Missing 'name' query parameter");
  }

  try {
    const allQuotes = readMasterQuotes();
    const filteredQuotes = filterQuotes(allQuotes, 'anime', name);

    if (filteredQuotes.length === 0) {
      return handleError(res, 404, `No quotes found for anime: "${name}"`);
    }

    const lim = Math.min(parseInt(limit, 10) || 3, 20);
    const off = parseInt(offset, 10) || 0;
    const randomQuotes = getRandomItems(filteredQuotes, lim);
    const page = paginate(randomQuotes, 0, lim);

    res.status(200).json({
      status: "success",
      data: {
        quotes: page.items,
        pagination: {
          total: filteredQuotes.length,
          limit: lim,
          offset: off,
          hasMore: page.hasMore
        }
      },
      meta: buildMeta()
    });
  } catch (error) {
    console.error('Error in fetching quotes:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

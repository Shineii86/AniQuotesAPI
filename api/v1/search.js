const { search } = require('../../utils/providers');
const { paginate } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');
const { buildMeta } = require('../../utils/config');

module.exports = async (req, res) => {
  const { q, limit, offset } = req.query;

  if (!q) {
    return handleError(res, 400, "Missing 'q' (search query) parameter");
  }

  try {
    const lim = Math.min(parseInt(limit, 10) || 5, 20);
    const off = parseInt(offset, 10) || 0;

    const result = await search(q, lim + off);

    if (result.total === 0) {
      return handleError(res, 404, `No quotes found matching: "${q}"`);
    }

    const page = paginate(result.quotes, off, lim);

    res.setHeader('Cache-Control', 'public, max-age=60');

    res.status(200).json({
      status: "success",
      data: {
        query: q,
        quotes: page.items,
        pagination: {
          total: result.total,
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

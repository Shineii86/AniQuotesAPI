const { getByAnime } = require('../../utils/providers');
const { paginate } = require('../../utils/helpers');
const { handleError } = require('../../utils/errors');
const { buildMeta } = require('../../utils/config');

module.exports = async (req, res) => {
  const { name, limit, offset } = req.query;

  if (!name) {
    return handleError(res, 400, "Missing 'name' query parameter");
  }

  try {
    const lim = Math.min(parseInt(limit, 10) || 3, 20);
    const off = parseInt(offset, 10) || 0;

    const result = await getByAnime(name, lim + off);

    if (result.total === 0) {
      return handleError(res, 404, `No quotes found for anime: "${name}"`);
    }

    const page = paginate(result.quotes, 0, lim);

    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
      status: "success",
      data: {
        quotes: page.items,
        pagination: {
          total: result.total,
          limit: lim,
          offset: off,
          hasMore: page.hasMore
        },
        sources: result.sources
      },
      meta: buildMeta()
    });
  } catch (error) {
    console.error('Error in fetching quotes:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

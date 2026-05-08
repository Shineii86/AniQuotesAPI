const { getRandom } = require('../../utils/providers');
const { handleError } = require('../../utils/errors');
const { buildMeta } = require('../../utils/config');

module.exports = async (req, res) => {
  try {
    const quote = await getRandom();

    if (!quote) {
      return handleError(res, 404, 'No quotes available');
    }

    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
      status: "success",
      data: quote,
      meta: buildMeta()
    });
  } catch (error) {
    console.error('Error fetching random quote:', error);
    handleError(res, 500, 'Internal Server Error');
  }
};

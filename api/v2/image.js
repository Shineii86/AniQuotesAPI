const { generateImage } = require('../../utils/imageGenerator');
const { handleError } = require('../../utils/errors');

module.exports = async (req, res) => {
  const { id, lang = 'en' } = req.query;
  
  if (!id) return handleError(res, 400, "Missing 'id' parameter");
  
  try {
    const imageBuffer = await generateImage(id, lang);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(imageBuffer);
  } catch (error) {
    if (error.message === 'Quote not found') {
      return handleError(res, 404, "Quote not found");
    }
    handleError(res, 500, 'Image generation failed');
  }
};

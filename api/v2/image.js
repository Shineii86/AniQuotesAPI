const { generateImage, generateImageFromQuote } = require('../../utils/imageGenerator');
const { getRandom } = require('../../utils/providers');
const { handleError } = require('../../utils/errors');

module.exports = async (req, res) => {
  const { id, lang = 'en', quote: quoteText, anime, character } = req.query;

  try {
    let imageBuffer;

    if (id) {
      // Mode 1: Generate by local quote ID
      imageBuffer = await generateImage(id, lang);
    } else if (quoteText && anime && character) {
      // Mode 2: Generate from inline quote data (works with any source)
      imageBuffer = await generateImageFromQuote({
        quote: quoteText,
        anime,
        character,
        language: lang
      });
    } else if (!id && !quoteText) {
      // Mode 3: Generate a random quote image
      const randomQuote = await getRandom();
      if (!randomQuote) {
        return handleError(res, 404, "No quotes available for image generation");
      }
      imageBuffer = await generateImageFromQuote(randomQuote);
    } else {
      return handleError(res, 400, "Provide either 'id' OR 'quote', 'anime', and 'character' parameters");
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(imageBuffer);
  } catch (error) {
    if (error.message === 'Quote not found') {
      return handleError(res, 404, "Quote not found");
    }
    console.error('Image generation error:', error.message);
    handleError(res, 500, 'Image generation failed');
  }
};

const fs = require('fs').promises;
const path = require('path');

// Cache HTML content in production
let cachedHtml = null;
const htmlPath = path.join(process.cwd(), 'public', 'index.html');

// Production: Cache on first request
// Development: Always read fresh file
const loadHomepage = async () => {
  if (process.env.NODE_ENV === 'production' && cachedHtml) {
    return cachedHtml;
  }
  
  try {
    const content = await fs.readFile(htmlPath, 'utf8');
    if (process.env.NODE_ENV === 'production') {
      cachedHtml = content;
    }
    return content;
  } catch (error) {
    console.error('Failed to load homepage:', error);
    throw error;
  }
};

module.exports = async (req, res) => {
  try {
    const htmlContent = await loadHomepage();
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600');
    res.send(htmlContent);
    
  } catch (error) {
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AniQuotes API - Error</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: #1a1a2e;
              color: #f0e6ff;
              padding: 2rem;
              text-align: center;
            }
            .error-container {
              max-width: 600px;
              margin: 5rem auto;
              padding: 2rem;
              background: rgba(30, 30, 46, 0.7);
              border-radius: 16px;
              border: 1px solid #ff2b79;
            }
            h1 { color: #ff2b79; }
            a { color: #9b30ff; }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h1>⚠️ Error Loading Homepage</h1>
            <p>We're unable to load the homepage at this time. Please try again later.</p>
            <p>In the meantime, you can access our API directly:</p>
            <ul style="list-style: none; padding: 0;">
              <li><a href="/v1/random">/v1/random</a> - Random quote</li>
              <li><a href="/v1/anime?name=Naruto">/v1/anime?name=[anime]</a> - Quotes by anime</li>
              <li><a href="/v2/image?id=1">/v2/image?id=[id]</a> - Generate quote image</li>
            </ul>
            <p style="margin-top: 2rem;">
              <a href="https://github.com/Shineii86/anime-quotes-api/issues">
                Report this issue on GitHub
              </a>
            </p>
          </div>
        </body>
      </html>
    `);
  }
};

const fs = require('fs');
const path = require('path');
const { readMasterQuotes, readLanguageQuotes } = require('./helpers');

// Cache for stats data
let statsCache = null;
let lastUpdated = 0;
const CACHE_DURATION = 300000; // 5 minutes

function getSupportedLanguages() {
  const languagesDir = path.join(process.cwd(), 'data', 'languages');
  try {
    return fs.readdirSync(languagesDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading languages directory:', error);
    return [];
  }
}

module.exports.getAPIStats = () => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (statsCache && (now - lastUpdated) < CACHE_DURATION) {
    return statsCache;
  }
  
  try {
    const masterQuotes = readMasterQuotes();
    const supportedLanguages = ['en', ...getSupportedLanguages()];
    
    const stats = {
      totalQuotes: masterQuotes.length,
      quotesByLanguage: {},
      quotesByAnime: {},
      quotesByCharacter: {},
      lastUpdated: new Date().toISOString(),
      supportedLanguages
    };
    
    // Process master quotes
    masterQuotes.forEach(quote => {
      // Count by anime
      const anime = quote.anime.trim();
      stats.quotesByAnime[anime] = (stats.quotesByAnime[anime] || 0) + 1;
      
      // Count by character
      const character = quote.character.trim();
      stats.quotesByCharacter[character] = (stats.quotesByCharacter[character] || 0) + 1;
    });
    
    // Process translations
    supportedLanguages.forEach(lang => {
      try {
        const quotes = readLanguageQuotes(lang);
        stats.quotesByLanguage[lang] = quotes.length;
      } catch (error) {
        console.error(`Error processing ${lang} quotes:`, error);
        stats.quotesByLanguage[lang] = 0;
      }
    });
    
    // Cache the results
    statsCache = stats;
    lastUpdated = now;
    
    return stats;
  } catch (error) {
    console.error('Error generating API stats:', error);
    return {
      error: 'Failed to generate statistics',
      details: error.message
    };
  }
};

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
    const supportedLanguages = getSupportedLanguages();
    
    const stats = {
      // Will calculate total later
      quotesByLanguage: {},
      quotesByAnime: {},
      quotesByCharacter: {},
      lastUpdated: new Date().toISOString(),
      supportedLanguages: ['en', ...supportedLanguages]
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
    
    // Set English count from master quotes
    stats.quotesByLanguage['en'] = masterQuotes.length;
    
    // Process other languages and calculate total quotes
    let totalQuotes = masterQuotes.length; // Start with English count
    
    supportedLanguages
      .filter(lang => lang !== 'en') // Exclude English
      .forEach(lang => {
        try {
          const quotes = readLanguageQuotes(lang);
          stats.quotesByLanguage[lang] = quotes.length;
          totalQuotes += quotes.length; // Add to total count
        } catch (error) {
          console.error(`Error processing ${lang} quotes:`, error);
          stats.quotesByLanguage[lang] = 0;
        }
      });
    
    // Set total quotes count
    stats.totalQuotes = totalQuotes;
    
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

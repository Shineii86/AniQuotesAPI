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
      quotesByLanguage: {},
      quotesByAnime: {},
      quotesByCharacter: {},
      lastUpdated: new Date().toISOString(),
      supportedLanguages: ['en', ...supportedLanguages]
    };
    
    // Process master quotes for anime/character counts
    masterQuotes.forEach(quote => {
      const anime = quote.anime.trim();
      const character = quote.character.trim();
      
      stats.quotesByAnime[anime] = (stats.quotesByAnime[anime] || 0) + 1;
      stats.quotesByCharacter[character] = (stats.quotesByCharacter[character] || 0) + 1;
    });
    
    // Calculate total quotes across all languages
    let totalQuotes = 0;
    
    // Process all languages including English
    stats.supportedLanguages.forEach(lang => {
      try {
        // For English, use master quotes directly
        const quotes = lang === 'en' 
          ? masterQuotes 
          : readLanguageQuotes(lang);
          
        const count = quotes.length;
        stats.quotesByLanguage[lang] = count;
        totalQuotes += count;
      } catch (error) {
        console.error(`Error processing ${lang} quotes:`, error);
        stats.quotesByLanguage[lang] = 0;
      }
    });
    
    // Add total quotes to stats
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

const fs = require('fs');
const path = require('path');

// Cache for quotes data
const quotesCache = new Map();

exports.readMasterQuotes = () => {
  if (quotesCache.has('master')) return quotesCache.get('master');
  
  const filePath = path.join(process.cwd(), 'data', 'quotes.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  quotesCache.set('master', data);
  return data;
};

exports.readLanguageQuotes = (lang = 'en') => {
  const cacheKey = `lang-${lang}`;
  if (quotesCache.has(cacheKey)) return quotesCache.get(cacheKey);
  
  try {
    const filePath = lang === 'en' 
      ? path.join(process.cwd(), 'data', 'quotes.json')
      : path.join(process.cwd(), 'data', 'languages', `${lang}.json`);
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    quotesCache.set(cacheKey, data);
    return data;
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

exports.getRandomQuote = (quotes) => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

exports.findQuoteById = (id, lang = 'en') => {
  const quotes = this.readLanguageQuotes(lang);
  const quote = quotes.find(q => q.id === parseInt(id));
  
  if (!quote && lang !== 'en') {
    // Fallback to English if not found in requested language
    const masterQuotes = this.readMasterQuotes();
    return masterQuotes.find(q => q.id === parseInt(id));
  }
  
  return quote;
};

exports.filterQuotes = (quotes, key, value) => {
  if (!value) return quotes;
  return quotes.filter(item => 
    String(item[key]).toLowerCase().includes(value.toLowerCase())
  );
};

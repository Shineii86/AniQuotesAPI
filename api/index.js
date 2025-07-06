const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const filePath = path.join(process.cwd(), 'public', 'index.html');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading homepage');
      return;
    }
    
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
  });
};

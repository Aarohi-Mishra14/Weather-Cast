const fs = require('fs');
let content = fs.readFileSync('./script.js', 'utf8');
content = content.replace('PASTE_YOUR_OPENWEATHERMAP_KEY_HERE', process.env.OPENWEATHER_API_KEY);
fs.writeFileSync('./script.js', content);
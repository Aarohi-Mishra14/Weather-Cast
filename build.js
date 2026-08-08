const fs = require('fs');
let content = fs.readFileSync('./JS/script.js', 'utf8');
content = content.replace('PASTE_YOUR_OPENWEATHERMAP_KEY_HERE', process.env.OPENWEATHER_API_KEY);
fs.writeFileSync('./JS/script.js', content);

# Weather-Cast
A live weather dashboard built with real APIs, async JavaScript and error handling. You search any city (or let it auto-detect your location) and it pulls live weather data, a 24-hour forecast and a 7-day outlook.

## What it does

- 🔍 Search any city and get live current weather
- 📍 Auto-detects your location on page load (with permission)
- ⏱️ 24-hour hourly and 7-day daily forecast, switchable with tabs
- 🌡️ Toggle between Celsius and Fahrenheit
- ⭐ Save cities to favorites (stored in localStorage)
- 🕘 Recent searches history
- 💾 Caches results for 10 minutes so repeated searches don't spam the API
- 🎨 Background theme changes based on the weather (rain, clear, snow, etc.)
- ⚠️ Proper error handling — searching for a city that doesn't exist shows a clean "not found" message instead of breaking

## Tech I used

- HTML, CSS, and vanilla JavaScript (no frameworks)
- [OpenWeatherMap API](https://openweathermap.org/api) for weather, forecast, UV index, and reverse geocoding
- fetch() with async/await for all network requests
- localStorage for caching, favorites and recent searches
- Font Awesome for icons and Google Fonts for typography

## How to run it locally

1. Clone this repo
2. Open `index.html` in your browser — that's it, no build step needed

## Setting up your own API key

This project needs a free API key from OpenWeatherMap to actually pull weather data.

1. Sign up at [openweathermap.org](https://openweathermap.org/) and grab a free API key
2. Open `script.js`
3. Find this line near the top:
   ```js
   apiKey: "PASTE_YOUR_OPENWEATHERMAP_KEY_HERE",
   ```
4. Replace it with your own key
5. Save the file and refresh the page

> Note: I didn't commit my own key here on purpose as API keys shouldn't be pushed to public repos.

## Known limitations

- If OpenWeatherMap's servers are down or rate-limited, the app just shows a generic error message
- Caching currently only applies to typed searches, not to auto-detected location loads

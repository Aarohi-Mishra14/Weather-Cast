const config = {
    apiKey: "PASTE_YOUR_OPENWEATHERMAP_KEY_HERE",
    weatherUrl: "https://api.openweathermap.org/data/2.5/weather",
    forecastUrl: "https://api.openweathermap.org/data/2.5/forecast",
    uviUrl: "https://api.openweathermap.org/data/2.5/uvi",
    geocodeUrl: "https://api.openweathermap.org/geo/1.0/reverse",
    defaultCity: "New Delhi"
};

const cacheDuration = 10 * 60 * 1000; 
const maxRecentSearches = 5;

const STORAGE_KEYS = {
    favorites: "weathercast_favorites",
    recentSearches: "weathercast_recent_searches",
    unit: "weathercast_unit",
    cachePrefix: "weathercast_cache_"
};

const popularCities = ["Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Jaipur", "Pune", "Ahmedabad"];

const conditionStyles = {
    Clear: { icon: "fa-sun", color: "#fbbf24" },
    Clouds: { icon: "fa-cloud", color: "#94a3b8" },
    Rain: { icon: "fa-cloud-showers-heavy", color: "#38bdf8" },
    Drizzle: { icon: "fa-cloud-rain", color: "#7dd3fc" },
    Thunderstorm: { icon: "fa-cloud-bolt", color: "#a78bfa" },
    Snow: { icon: "fa-snowflake", color: "#a5f3fc" },
    Mist: { icon: "fa-smog", color: "#a1a1aa" },
    Fog: { icon: "fa-smog", color: "#a1a1aa" },
    Haze: { icon: "fa-smog", color: "#a1a1aa" },
    Smoke: { icon: "fa-smog", color: "#a1a1aa" },
    Dust: { icon: "fa-smog", color: "#c7a37a" },
    Tornado: { icon: "fa-wind", color: "#f87171" }
};

const conditionDescriptions = {
    Clear: "Bright sunny conditions with clear skies",
    Clouds: "Overcast skies with cloud cover expected",
    Rain: "Wet conditions with rainfall likely through the day",
    Drizzle: "Light drizzle expected on and off",
    Thunderstorm: "Stormy conditions with thunder and lightning",
    Snow: "Cold conditions with snowfall expected",
    Mist: "Reduced visibility due to mist in the air",
    Fog: "Reduced visibility due to fog",
    Haze: "Hazy skies with reduced visibility",
    Smoke: "Smoky conditions with reduced air quality",
    Dust: "Dusty conditions with reduced visibility"
};

const appState = {
    unitSystem: "metric",
    currentCity: null,
    currentCountry: null,
    currentRegion: null,
    currentLocation: null,
    currentTimezoneOffset: 0,
    currentWeather: null,
    forecastData: null,
    forecastMode: "hourly",
    favorites: [],
    recentSearches: [],
    lastUpdated: null,
    isFetching: false,
    storageAvailable: true
};

const elements = {
    locationBtn: document.getElementById("location_btn"),
    refreshBtn: document.getElementById("refresh_btn"),
    favoritesBtn: document.getElementById("favorites_btn"),
    favoritesCountBadge: document.getElementById("favorites_count"),
    unitCBtn: document.getElementById("celsius_btn"),
    unitFBtn: document.getElementById("fahrenheit_btn"),
    citySearchInput: document.getElementById("city_input"),
    searchBtn: document.getElementById("search_btn"),
    recentSearchesPanel: document.getElementById("recent_searches"),
    recentSearchesList: document.getElementById("recent_list"),
    clearHistoryBtn: document.getElementById("clear_history"),
    popularCitiesRow: document.getElementById("popular_cities"),
    popularCitiesList: document.getElementById("popular_list"),
    loadingState: document.getElementById("loading_state"),
    errorState: document.getElementById("error_state"),
    errorTitleText: document.getElementById("error_title_text"),
    errorMessageText: document.getElementById("error_message_text"),
    errorRetryBtn: document.getElementById("error_retry_btn"),
    weatherContent: document.getElementById("weather_content"),
    cityNameText: document.getElementById("city_name"),
    regionCountryText: document.getElementById("city_location"),
    shortDateText: document.getElementById("date"),
    clockTimeText: document.getElementById("time"),
    daytimeBadge: document.getElementById("day_time"),
    highTempText: document.getElementById("high_temp"),
    lowTempText: document.getElementById("low_temp"),
    favoriteToggleBtn: document.getElementById("favorite_btn"),
    weatherIconContainer: document.getElementById("weather_icon"),
    weatherIcon: document.getElementById("weather_icon_img"),
    temperature: document.getElementById("temperature"),
    tempUnitSup: document.getElementById("temp_unit"),
    condition: document.getElementById("weather_type"),
    description: document.getElementById("weather_info"),
    feelsLikeInlineText: document.getElementById("feels_like"),
    miniHumidity: document.getElementById("humidity"),
    miniWind: document.getElementById("wind_speed"),
    miniWindDirectionIcon: document.getElementById("wind_arrow"),
    miniPressure: document.getElementById("pressure"),
    miniVisibility: document.getElementById("visibility"),
    windDirectionIcon: document.getElementById("wind_icon"),
    windDirectionValue: document.getElementById("wind_direction"),
    uvValue: document.getElementById("uv_index"),
    sunriseValue: document.getElementById("sunrise"),
    sunsetValue: document.getElementById("sunset"),
    feelsLikeValue: document.getElementById("feels_temp"),
    hourlyViewBtn: document.getElementById("hourly_btn"),
    dailyViewBtn: document.getElementById("daily_btn"),
    hourlyForecastRow: document.getElementById("hourly_forecast"),
    dailyForecastRow: document.getElementById("daily_forecast"),
    lastUpdatedFooterText: document.getElementById("last_update"),
    toastMessage: document.getElementById("message"),
    appBody: document.getElementById("body"),
    favoritesOverlay: document.getElementById("overlay"),
    favoritesPanel: document.getElementById("favorites_box"),
    favoritesCloseBtn: document.getElementById("close_btn"),
    favoritesCountText: document.getElementById("favorites_total"),
    favoritesList: document.getElementById("favorites_list"),
    clearAllFavoritesBtn: document.getElementById("clear_favorites")
};

const {
    locationBtn, refreshBtn, favoritesBtn, favoritesCountBadge, unitCBtn, unitFBtn,
    citySearchInput, searchBtn, recentSearchesPanel, recentSearchesList, clearHistoryBtn,
    popularCitiesRow, popularCitiesList, loadingState, errorState, errorTitleText, errorMessageText,
    errorRetryBtn, weatherContent, cityNameText, regionCountryText, shortDateText, clockTimeText,
    daytimeBadge, highTempText, lowTempText, favoriteToggleBtn, weatherIconContainer, weatherIcon,
    temperature, tempUnitSup, condition, description, feelsLikeInlineText, miniHumidity, miniWind,
    miniWindDirectionIcon, miniPressure, miniVisibility, windDirectionIcon, windDirectionValue,
    uvValue, sunriseValue, sunsetValue, feelsLikeValue, hourlyViewBtn, dailyViewBtn,
    hourlyForecastRow, dailyForecastRow, lastUpdatedFooterText, toastMessage, appBody,
    favoritesOverlay, favoritesPanel, favoritesCloseBtn, favoritesCountText, favoritesList,
    clearAllFavoritesBtn
} = elements;

function isStorageAvailable() {
    try {
        const testKey = "weathercast_storage_test";
        localStorage.setItem(testKey, "1");
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

function loadFavorites() {
    if (!appState.storageAvailable) {
        appState.favorites = [];
        return;
    }
    const stored = localStorage.getItem(STORAGE_KEYS.favorites);
    appState.favorites = stored ? JSON.parse(stored) : [];
}

function saveFavorites() {
    if (!appState.storageAvailable) return;
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(appState.favorites));
}

function loadRecentSearches() {
    if (!appState.storageAvailable) {
        appState.recentSearches = [];
        return;
    }
    const stored = localStorage.getItem(STORAGE_KEYS.recentSearches);
    appState.recentSearches = stored ? JSON.parse(stored) : [];
}

function saveRecentSearches() {
    if (!appState.storageAvailable) return;
    localStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(appState.recentSearches));
}

function loadUnitSystem() {
    if (!appState.storageAvailable) return;
    const stored = localStorage.getItem(STORAGE_KEYS.unit);
    appState.unitSystem = stored || "metric";
}

function saveUnitSystem() {
    if (!appState.storageAvailable) return;
    localStorage.setItem(STORAGE_KEYS.unit, appState.unitSystem);
}

function getCachedData(cacheKey) {
    if (!appState.storageAvailable) return null;

    const raw = localStorage.getItem(STORAGE_KEYS.cachePrefix + cacheKey);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        const age = Date.now() - parsed.cachedAt;
        return age > cacheDuration ? null : parsed;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function saveCacheData(cacheKey, currentData, forecastData, regionData) {
    if (!appState.storageAvailable) return;
    const payload = { cachedAt: Date.now(), currentData, forecastData, regionData };
    localStorage.setItem(STORAGE_KEYS.cachePrefix + cacheKey, JSON.stringify(payload));
}

function getCacheKey(rawKey) {
    return rawKey.toLowerCase().trim().replace(/\s+/g, "_");
}

function showToast(text) {
    toastMessage.textContent = text;
    toastMessage.classList.remove("hidden");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toastMessage.classList.add("hidden");
    }, 2400);
}

function sanitizeText(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function capitalizeWords(text) {
    return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getConditionStyle(weatherType) {
    return conditionStyles[weatherType] || { icon: "fa-cloud", color: "#94a3b8" };
}

function getIconUrl(iconCode) {
    return "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
}

function getWeatherDescription(weatherType, fallbackDescription) {
    if (conditionDescriptions[weatherType]) {
        return conditionDescriptions[weatherType];
    }
    return capitalizeWords(fallbackDescription);
}

function getCityDate(unixSeconds, timezoneOffsetSeconds) {
    return new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
}

function formatClockTime(unixSeconds, timezoneOffsetSeconds) {
    const localDate = getCityDate(unixSeconds, timezoneOffsetSeconds);
    let hours = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes();
    const suffix = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    const minuteText = minutes < 10 ? "0" + minutes : String(minutes);
    return hours + ":" + minuteText + " " + suffix;
}

function formatHourLabel(unixSeconds, timezoneOffsetSeconds, isFirst) {
    if (isFirst) return "Now";

    const localDate = getCityDate(unixSeconds, timezoneOffsetSeconds);
    let hours = localDate.getUTCHours();
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return hours + " " + suffix;
}

function formatDayLabel(unixSeconds, timezoneOffsetSeconds) {
    const localDate = getCityDate(unixSeconds, timezoneOffsetSeconds);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[localDate.getUTCDay()];
}

function formatShortDate(unixSeconds, timezoneOffsetSeconds) {
    const localDate = getCityDate(unixSeconds, timezoneOffsetSeconds);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return days[localDate.getUTCDay()] + ", " + months[localDate.getUTCMonth()] + " " + localDate.getUTCDate();
}

function formatTemperature(celsiusValue) {
    if (appState.unitSystem === "imperial") {
        return Math.round((celsiusValue * 9) / 5 + 32);
    }
    return Math.round(celsiusValue);
}

function formatWindSpeed(metersPerSecond) {
    if (appState.unitSystem === "imperial") {
        return Math.round(metersPerSecond * 2.237) + " mph";
    }
    return Math.round(metersPerSecond * 3.6) + " km/h";
}

function formatVisibility(meters) {
    if (appState.unitSystem === "imperial") {
        return (meters / 1609).toFixed(1) + " mi";
    }
    return (meters / 1000).toFixed(1) + " km";
}

function degToCompass(deg) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
}

function applyWeatherTheme(weatherType) {
    const themeMap = {
        Clear: "theme_clear",
        Clouds: "theme_clouds",
        Rain: "theme_rain",
        Drizzle: "theme_rain",
        Thunderstorm: "theme_thunderstorm",
        Snow: "theme_snow",
        Mist: "theme_mist",
        Fog: "theme_mist",
        Haze: "theme_mist",
        Smoke: "theme_mist",
        Dust: "theme_mist"
    };

    appBody.classList.remove("theme_clear", "theme_clouds", "theme_rain", "theme_thunderstorm", "theme_snow", "theme_mist");

    const themeClass = themeMap[weatherType];
    if (themeClass) appBody.classList.add(themeClass);
}

function isRequestBusy() {
    if (appState.isFetching) {
        showToast("Still loading the last request - one moment.");
        return true;
    }
    return false;
}

function showLoading() {
    appState.isFetching = true;
    searchBtn.disabled = true;
    loadingState.classList.remove("hidden");
    errorState.classList.add("hidden");
    weatherContent.classList.add("hidden");
}

function showError(title, message) {
    appState.isFetching = false;
    searchBtn.disabled = false;
    loadingState.classList.add("hidden");
    weatherContent.classList.add("hidden");
    errorState.classList.remove("hidden");
    errorTitleText.textContent = title;
    errorMessageText.textContent = message;
}

function showWeatherContent() {
    appState.isFetching = false;
    searchBtn.disabled = false;
    loadingState.classList.add("hidden");
    errorState.classList.add("hidden");
    weatherContent.classList.remove("hidden");
}

async function fetchWeatherByCity(cityQuery) {
    const url = config.weatherUrl + "?q=" + encodeURIComponent(cityQuery) + "&appid=" + config.apiKey + "&units=metric";
    const response = await fetch(url);
    if (!response.ok) {
        const error = new Error("Current weather request failed");
        error.status = response.status;
        throw error;
    }
    return response.json();
}

async function fetchWeatherByLocation(lat, lon) {
    const url = config.weatherUrl + "?lat=" + lat + "&lon=" + lon + "&appid=" + config.apiKey + "&units=metric";
    const response = await fetch(url);
    if (!response.ok) {
        const error = new Error("Current weather request failed");
        error.status = response.status;
        throw error;
    }
    return response.json();
}

async function fetchForecast(lat, lon) {
    const url = config.forecastUrl + "?lat=" + lat + "&lon=" + lon + "&appid=" + config.apiKey + "&units=metric";
    const response = await fetch(url);
    if (!response.ok) {
        const error = new Error("Forecast request failed");
        error.status = response.status;
        throw error;
    }
    return response.json();
}

async function fetchUvIndex(lat, lon) {
    try {
        const url = config.uviUrl + "?lat=" + lat + "&lon=" + lon + "&appid=" + config.apiKey;
        const response = await fetch(url);
        if (!response.ok) return null;

        const data = await response.json();
        return typeof data.value === "number" ? data.value : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function fetchRegion(lat, lon) {
    try {
        const url = config.geocodeUrl + "?lat=" + lat + "&lon=" + lon + "&limit=1&appid=" + config.apiKey;
        const response = await fetch(url);
        if (!response.ok) return null;

        const data = await response.json();
        if (!data || !data.length) return null;

        return { state: data[0].state || null, country: data[0].country || null };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function loadWeather(cityQuery, options) {
    const forceRefresh = options && options.forceRefresh;
    const cacheKey = getCacheKey(cityQuery);

    showLoading();

    if (!forceRefresh) {
        const cached = getCachedData(cacheKey);
        if (cached) {
            updateWeatherUI(cached.currentData, cached.forecastData, null, cached.regionData);
            showToast("Loaded " + cached.currentData.name + " from cache.");
            return;
        }
    }

    try {
        const currentData = await fetchWeatherByCity(cityQuery);
        const forecastData = await fetchForecast(currentData.coord.lat, currentData.coord.lon);
        const uvi = await fetchUvIndex(currentData.coord.lat, currentData.coord.lon);
        const regionData = await fetchRegion(currentData.coord.lat, currentData.coord.lon);

        saveCacheData(cacheKey, currentData, forecastData, regionData);
        updateWeatherUI(currentData, forecastData, uvi, regionData);
    } catch (error) {
        console.error(error);
        handleWeatherError(error, cityQuery);
    }
}

async function loadWeatherByLocation(lat, lon, cacheLabel) {
    showLoading();

    try {
        const currentData = await fetchWeatherByLocation(lat, lon);
        const forecastData = await fetchForecast(lat, lon);
        const uvi = await fetchUvIndex(lat, lon);
        const regionData = await fetchRegion(lat, lon);

        saveCacheData(getCacheKey(currentData.name), currentData, forecastData, regionData);
        updateWeatherUI(currentData, forecastData, uvi, regionData);
    } catch (error) {
        console.error(error);
        handleWeatherError(error, cacheLabel);
    }
}

function handleWeatherError(error, cityQuery) {
    if (error.status === 404) {
        showError("City not found", 'Please check the spelling or try another location. The server returned a 404 lookup code for "' + sanitizeText(cityQuery) + '".');
        return;
    }
    if (error.status === 401) {
        showError("API key issue", "The weather provider rejected the request. Check that a valid API key has been set in script.js.");
        return;
    }
    showError("Something went wrong", "We could not reach the weather service right now. Check your connection and try again.");
}

function updateWeatherUI(currentData, forecastData, uvi, regionData) {
    appState.currentWeather = currentData;
    appState.forecastData = forecastData;
    appState.currentCity = currentData.name;
    appState.currentCountry = currentData.sys && currentData.sys.country ? currentData.sys.country : "";
    appState.currentRegion = regionData && regionData.state ? regionData.state : null;
    appState.currentLocation = { lat: currentData.coord.lat, lon: currentData.coord.lon };
    appState.currentTimezoneOffset = currentData.timezone || 0;
    appState.lastUpdated = new Date();

    applyWeatherTheme(currentData.weather[0].main);
    renderCurrentSection(currentData, uvi);
    renderHourlySection(currentData, forecastData);
    renderDailySection(forecastData);
    updateFavoriteButton();
    updateTimestamps();
    pushRecentSearch(currentData.name, appState.currentCountry, appState.currentLocation);
    showWeatherContent();
}

function renderCurrentSection(data, uvi) {
    updateHeader(data);
    updateTemperature(data);
    updateWeatherStats(data);
    updateSunSection(data, uvi);
    updateWindSection(data);
}

function updateHeader(data) {
    cityNameText.textContent = data.name;
    regionCountryText.textContent = appState.currentRegion
        ? appState.currentRegion + ", " + appState.currentCountry
        : appState.currentCountry;
    shortDateText.textContent = formatShortDate(data.dt, appState.currentTimezoneOffset);
    clockTimeText.textContent = formatClockTime(data.dt, appState.currentTimezoneOffset);

    const isDaytime = data.dt >= data.sys.sunrise && data.dt < data.sys.sunset;
    daytimeBadge.textContent = isDaytime ? "Daytime" : "Nighttime";
}

function updateTemperature(data) {
    const weatherType = data.weather[0].main;
    const weatherStyle = getConditionStyle(weatherType);

    const todayTemp = getTodayHighLow(appState.forecastData, data);
    highTempText.textContent = formatTemperature(todayTemp.high);
    lowTempText.textContent = formatTemperature(todayTemp.low);

    weatherIconContainer.style.setProperty("--condition-color", weatherStyle.color);
    weatherIcon.src = getIconUrl(data.weather[0].icon);
    weatherIcon.alt = data.weather[0].description;

    temperature.textContent = formatTemperature(data.main.temp);
    tempUnitSup.textContent = appState.unitSystem === "imperial" ? "\u00b0F" : "\u00b0C";

    condition.textContent = capitalizeWords(data.weather[0].description);
    description.textContent = getWeatherDescription(weatherType, data.weather[0].description);
    feelsLikeInlineText.textContent = formatTemperature(data.main.feels_like) + "\u00b0";
}

function updateWeatherStats(data) {
    const { humidity, pressure } = data.main;

    miniHumidity.textContent = humidity + "%";
    miniWind.textContent = formatWindSpeed(data.wind.speed);
    miniPressure.textContent = pressure + " hPa";
    miniVisibility.textContent = formatVisibility(data.visibility);
}

function updateWindSection(data) {
    const windDeg = data.wind.deg || 0;
    const windRotation = "rotate(" + windDeg + "deg)";

    miniWindDirectionIcon.style.transform = windRotation;
    windDirectionIcon.style.transform = windRotation;
    windDirectionValue.textContent = degToCompass(windDeg) + " (" + Math.round(windDeg) + "\u00b0)";
}

function updateSunSection(data, uvi) {
    uvValue.textContent = uvi === null || uvi === undefined ? "N/A" : Math.round(uvi) + (uvi >= 6 ? " (High)" : "");
    sunriseValue.textContent = formatClockTime(data.sys.sunrise, appState.currentTimezoneOffset);
    sunsetValue.textContent = formatClockTime(data.sys.sunset, appState.currentTimezoneOffset);
    feelsLikeValue.textContent = formatTemperature(data.main.feels_like) + "\u00b0";
}

function getTodayHighLow(forecastData, currentData) {
    if (!forecastData || !forecastData.list) {
        return { high: currentData.main.temp_max, low: currentData.main.temp_min };
    }

    const todayKey = getCityDate(currentData.dt, appState.currentTimezoneOffset).toISOString().slice(0, 10);
    const todaysEntries = forecastData.list.filter((item) => {
        return getCityDate(item.dt, appState.currentTimezoneOffset).toISOString().slice(0, 10) === todayKey;
    });

    if (todaysEntries.length === 0) {
        return { high: currentData.main.temp_max, low: currentData.main.temp_min };
    }

    let high = -Infinity;
    let low = Infinity;
    for (const item of todaysEntries) {
        high = Math.max(high, item.main.temp_max);
        low = Math.min(low, item.main.temp_min);
    }
    return { high, low };
}

function renderHourlySection(currentData, forecastData) {
    const nowTile = buildForecastTile(
        "Now",
        currentData.weather[0].main,
        currentData.weather[0].description,
        formatTemperature(currentData.main.temp) + "\u00b0",
        null,
        true,
        false
    );

    const upcomingTiles = forecastData.list.slice(0, 7).map((item) => {
        const label = formatHourLabel(item.dt, appState.currentTimezoneOffset, false);
        const popPercent = Math.round((item.pop || 0) * 100);
        return buildForecastTile(label, item.weather[0].main, item.weather[0].description, formatTemperature(item.main.temp) + "\u00b0", popPercent, false, false);
    });

    hourlyForecastRow.innerHTML = [nowTile, ...upcomingTiles].join("");
}

function renderDailySection(forecastData) {
    const groupedByDay = {};
    const orderedKeys = [];

    for (const item of forecastData.list) {
        const localDate = getCityDate(item.dt, appState.currentTimezoneOffset);
        const dayKey = localDate.toISOString().slice(0, 10);
        if (!groupedByDay[dayKey]) {
            groupedByDay[dayKey] = { items: [], dayKey };
            orderedKeys.push(dayKey);
        }
        groupedByDay[dayKey].items.push(item);
    }

    const dailyTiles = orderedKeys.map((dayKey, index) => {
        return buildDailyTile(groupedByDay[dayKey], index);
    });

    dailyForecastRow.innerHTML = dailyTiles.join("");
}

function buildDailyTile(group, index) {
    let high = -Infinity;
    let low = Infinity;
    for (const item of group.items) {
        high = Math.max(high, item.main.temp_max);
        low = Math.min(low, item.main.temp_min);
    }

    const middayItem = group.items.reduce((closest, item) => {
        const hour = getCityDate(item.dt, appState.currentTimezoneOffset).getUTCHours();
        const closestHour = getCityDate(closest.dt, appState.currentTimezoneOffset).getUTCHours();
        return Math.abs(hour - 13) < Math.abs(closestHour - 13) ? item : closest;
    }, group.items[0]);

    const maxPop = group.items.reduce((max, item) => Math.max(max, item.pop || 0), 0);

    const dayLabel = index === 0 ? "Today" : formatDayLabel(group.items[0].dt, appState.currentTimezoneOffset);
    const tempLabel = formatTemperature(high) + "\u00b0/" + formatTemperature(low) + "\u00b0";

    return buildForecastTile(dayLabel, middayItem.weather[0].main, middayItem.weather[0].description, tempLabel, Math.round(maxPop * 100), index === 0, true);
}

function buildForecastTile(label, weatherType, weatherDescription, tempLabel, popPercent, isActive, isDaily) {
    const activeClass = isActive ? " active_forecast_tile" : "";
    const weatherStyle = getConditionStyle(weatherType);
    const popText = popPercent === null || popPercent === undefined ? "--%" : popPercent + "%";

    return '<div class="forecast_tile' + activeClass + '">' +
        '<div class="forecast_tile_label">' + sanitizeText(label) + "</div>" +
        '<div class="forecast_tile_icon" style="color: ' + weatherStyle.color + '"><i class="fa-solid ' + weatherStyle.icon + '"></i></div>' +
        '<div class="forecast_tile_temp">' + tempLabel + "</div>" +
        '<div class="forecast_tile_sub"><i class="fa-solid fa-droplet"></i> ' + popText + "</div>" +
        (isDaily ? '<div class="forecast_tile_condition">' + sanitizeText(weatherDescription) + "</div>" : "") +
        "</div>";
}

function updateTimestamps() {
    refreshFooterElapsedText();
}

function refreshFooterElapsedText() {
    if (!appState.lastUpdated) {
        lastUpdatedFooterText.textContent = "Last updated: --";
        return;
    }

    const elapsedMs = Date.now() - appState.lastUpdated.getTime();
    const elapsedMinutes = Math.floor(elapsedMs / 60000);

    if (elapsedMinutes <= 0) {
        lastUpdatedFooterText.textContent = "Last updated: just now";
    } else if (elapsedMinutes === 1) {
        lastUpdatedFooterText.textContent = "Last updated: 1 minute ago";
    } else {
        lastUpdatedFooterText.textContent = "Last updated: " + elapsedMinutes + " minutes ago";
    }
}

setInterval(refreshFooterElapsedText, 30000);

hourlyViewBtn.addEventListener("click", () => {
    appState.forecastMode = "hourly";
    hourlyViewBtn.classList.add("active");
    dailyViewBtn.classList.remove("active");
    hourlyForecastRow.classList.remove("hidden");
    dailyForecastRow.classList.add("hidden");
});

dailyViewBtn.addEventListener("click", () => {
    appState.forecastMode = "daily";
    dailyViewBtn.classList.add("active");
    hourlyViewBtn.classList.remove("active");
    dailyForecastRow.classList.remove("hidden");
    hourlyForecastRow.classList.add("hidden");
});

function runSearch() {
    if (isRequestBusy()) return;

    const query = citySearchInput.value.trim();
    if (!query) {
        showToast("Type a city name first.");
        return;
    }
    loadWeather(query, { forceRefresh: false });
}

searchBtn.addEventListener("click", runSearch);

citySearchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        runSearch();
    }
});

errorRetryBtn.addEventListener("click", function () {
    errorState.classList.add("hidden");
    citySearchInput.value = "";
    citySearchInput.focus();
});

function pushRecentSearch(city, country, coords) {
    appState.recentSearches = appState.recentSearches.filter((entry) => entry.city.toLowerCase() !== city.toLowerCase());
    appState.recentSearches.unshift({ city, country, lat: coords.lat, lon: coords.lon });
    appState.recentSearches = appState.recentSearches.slice(0, maxRecentSearches);

    saveRecentSearches();
    renderRecentSearches();
}

function renderRecentSearches() {
    if (appState.recentSearches.length > 0) {
        recentSearchesPanel.classList.remove("hidden");
        popularCitiesRow.classList.add("hidden");
        recentSearchesList.innerHTML = appState.recentSearches.map((entry, index) => {
            return '<button type="button" class="recent_search_chip" data-recent-index="' + index + '">' +
                '<i class="fa-solid fa-location-dot"></i> ' + sanitizeText(entry.city) + ", " + sanitizeText(entry.country) +
                "</button>";
        }).join("");
    } else {
        recentSearchesPanel.classList.add("hidden");
        popularCitiesRow.classList.remove("hidden");
    }
}

function renderPopularCities() {
    popularCitiesList.innerHTML = popularCities.map((city) => {
        return '<button type="button" class="popular_city_chip" data-city="' + sanitizeText(city) + '">' + sanitizeText(city) + "</button>";
    }).join("");
}

recentSearchesList.addEventListener("click", function (event) {
    const chip = event.target.closest("[data-recent-index]");
    if (!chip || isRequestBusy()) return;

    const entry = appState.recentSearches[Number(chip.getAttribute("data-recent-index"))];
    if (entry) {
        loadWeatherByLocation(entry.lat, entry.lon, entry.city);
    }
});

popularCitiesList.addEventListener("click", function (event) {
    const chip = event.target.closest("[data-city]");
    if (!chip || isRequestBusy()) return;

    loadWeather(chip.getAttribute("data-city"), { forceRefresh: false });
});

clearHistoryBtn.addEventListener("click", function () {
    appState.recentSearches = [];
    saveRecentSearches();
    renderRecentSearches();
    showToast("Search history cleared.");
});

refreshBtn.addEventListener("click", function () {
    if (isRequestBusy()) return;

    if (appState.currentLocation) {
        loadWeatherByLocation(appState.currentLocation.lat, appState.currentLocation.lon, appState.currentCity || config.defaultCity);
        showToast("Refreshed latest data.");
    } else {
        loadWeather(config.defaultCity, { forceRefresh: true });
    }
});

locationBtn.addEventListener("click", function () {
    if (isRequestBusy()) return;
    requestUserLocation();
});

function requestUserLocation(isAutoLoad) {
    if (!navigator.geolocation) {
        if (isAutoLoad) {
            loadWeather(config.defaultCity, { forceRefresh: false });
        } else {
            showToast("Geolocation is not supported in this browser.");
        }
        return;
    }

    if (isAutoLoad) {
        showLoading();
    } else {
        showToast("Requesting location access...");
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            loadWeatherByLocation(lat, lon, lat.toFixed(2) + "," + lon.toFixed(2));
            if (!isAutoLoad) showToast("Using your current location.");
        },
        function () {
            if (isAutoLoad) {
                loadWeather(config.defaultCity, { forceRefresh: false });
            } else {
                showToast("Location access denied.");
            }
        },
        { timeout: 15000 }
    );
}

unitCBtn.addEventListener("click", function () {
    if (appState.unitSystem === "metric") return;

    appState.unitSystem = "metric";
    unitCBtn.classList.add("active");
    unitFBtn.classList.remove("active");
    saveUnitSystem();

    if (appState.currentWeather && appState.forecastData) {
        updateWeatherUI(
            appState.currentWeather,
            appState.forecastData,
            null,
            appState.currentRegion ? { state: appState.currentRegion, country: appState.currentCountry } : null
        );
    }
});

unitFBtn.addEventListener("click", function () {
    if (appState.unitSystem === "imperial") return;

    appState.unitSystem = "imperial";
    unitFBtn.classList.add("active");
    unitCBtn.classList.remove("active");
    saveUnitSystem();

    if (appState.currentWeather && appState.forecastData) {
        updateWeatherUI(
            appState.currentWeather,
            appState.forecastData,
            null,
            appState.currentRegion ? { state: appState.currentRegion, country: appState.currentCountry } : null
        );
    }
});

function updateFavoriteButton() {
    const isFavorite = appState.favorites.some((item) => item.city.toLowerCase() === (appState.currentCity || "").toLowerCase());
    favoriteToggleBtn.classList.toggle("active", isFavorite);
}

function updateFavoritesCount() {
    const count = appState.favorites.length;
    favoritesCountText.textContent = count + (count === 1 ? " bookmarked city" : " bookmarked cities");

    if (count > 0) {
        favoritesCountBadge.textContent = String(count);
        favoritesCountBadge.classList.remove("hidden");
    } else {
        favoritesCountBadge.classList.add("hidden");
    }
    clearAllFavoritesBtn.classList.toggle("hidden", count === 0);
}

function renderFavorites() {
    updateFavoritesCount();

    if (appState.favorites.length === 0) {
        favoritesList.innerHTML = '<p class="favorites_empty_state">No favorite cities yet. Tap the bookmark icon on any city to save it here.</p>';
        return;
    }

    favoritesList.innerHTML = appState.favorites.map((item, index) => {
        const subtitle = item.region ? item.region + ", " + item.country : item.country;
        return '<div class="favorite_item" data-favorite-index="' + index + '">' +
            '<div class="favorite_item_left">' +
            '<span class="favorite_item_icon"><i class="fa-solid fa-location-dot"></i></span>' +
            '<div class="favorite_item_text"><b>' + sanitizeText(item.city) + "</b><span>" + sanitizeText(subtitle) + "</span></div>" +
            "</div>" +
            '<button type="button" class="favorite_remove_btn" data-remove-index="' + index + '" aria-label="Remove ' + sanitizeText(item.city) + ' from favorites"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>' +
            "</div>";
    }).join("");
}

favoriteToggleBtn.addEventListener("click", function () {
    if (!appState.currentCity) return;

    const existingIndex = appState.favorites.findIndex((item) => item.city.toLowerCase() === appState.currentCity.toLowerCase());

    if (existingIndex >= 0) {
        appState.favorites.splice(existingIndex, 1);
        showToast("Removed from favorites.");
    } else {
        appState.favorites.push({
            city: appState.currentCity,
            region: appState.currentRegion,
            country: appState.currentCountry,
            lat: appState.currentLocation.lat,
            lon: appState.currentLocation.lon
        });
        showToast("Added to favorites.");
    }

    saveFavorites();
    renderFavorites();
    updateFavoriteButton();
});

favoritesList.addEventListener("click", function (event) {
    const removeBtn = event.target.closest("[data-remove-index]");
    if (removeBtn) {
        event.stopPropagation();
        appState.favorites.splice(Number(removeBtn.getAttribute("data-remove-index")), 1);
        saveFavorites();
        renderFavorites();
        updateFavoriteButton();
        return;
    }

    const item = event.target.closest("[data-favorite-index]");
    if (item) {
        if (isRequestBusy()) return;
        const favorite = appState.favorites[Number(item.getAttribute("data-favorite-index"))];
        closeFavoritesDrawer();
        loadWeatherByLocation(favorite.lat, favorite.lon, favorite.city);
    }
});

clearAllFavoritesBtn.addEventListener("click", function () {
    appState.favorites = [];
    saveFavorites();
    renderFavorites();
    updateFavoriteButton();
    showToast("All favorites cleared.");
});

function openFavoritesDrawer() {
    favoritesOverlay.classList.remove("hidden");
    favoritesPanel.classList.remove("hidden");
}

function closeFavoritesDrawer() {
    favoritesOverlay.classList.add("hidden");
    favoritesPanel.classList.add("hidden");
}

favoritesBtn.addEventListener("click", openFavoritesDrawer);
favoritesCloseBtn.addEventListener("click", closeFavoritesDrawer);
favoritesOverlay.addEventListener("click", closeFavoritesDrawer);

async function startDashboard() {
    appState.storageAvailable = isStorageAvailable();
    loadFavorites();
    loadRecentSearches();
    loadUnitSystem();

    if (appState.unitSystem === "imperial") {
        unitFBtn.classList.add("active");
        unitCBtn.classList.remove("active");
    }

    renderFavorites();
    renderPopularCities();
    renderRecentSearches();

    if (!appState.storageAvailable) {
        showToast("Local storage is not available - favorites and caching are disabled.");
    }

    requestUserLocation(true);
}

startDashboard();

const axios = require("axios");
const cache = require("./cache");

const CACHE_KEY = "raw_data";
const CACHE_TTL = 60000; // 60 seconds cache

/**
 * Fetches raw data from the GitHub Pages endpoint with caching
 * @returns {Promise<Array>} The raw data array
 * @throws {Error} If the fetch fails
 */
async function fetchRawData() {
    // Check cache first
    const cachedData = cache.get(CACHE_KEY);
    if (cachedData) {
        return cachedData;
    }

    // Fetch from remote if not cached
    try {
        const result = await axios.get("https://is-cool-me.github.io/raw", {
            timeout: 8000 // 8 second timeout
        });

        const data = result.data;
        
        // Cache the result
        cache.set(CACHE_KEY, data, CACHE_TTL);
        
        return data;
    } catch (err) {
        throw new Error("Failed to fetch data");
    }
}

module.exports = { fetchRawData };

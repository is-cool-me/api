/**
 * Simple in-memory cache with TTL (Time To Live) support.
 * This class implements a singleton pattern for caching data across the application.
 * 
 * Features:
 * - Automatic expiration based on TTL
 * - Memory-efficient cleanup of expired entries
 * - Simple key-value storage
 * 
 * Usage:
 *   const cache = require('./cache');
 *   cache.set('myKey', myValue, 60000); // Cache for 60 seconds
 *   const value = cache.get('myKey'); // Returns value or null if expired/not found
 */
class Cache {
    constructor() {
        this.cache = new Map();
    }

    set(key, value, ttl = 60000) { // Default 60 seconds TTL
        const expiresAt = Date.now() + ttl;
        this.cache.set(key, { value, expiresAt });
    }

    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }

        // Check if expired
        if (Date.now() > item.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    clear() {
        this.cache.clear();
    }
}

// Export a singleton instance
module.exports = new Cache();

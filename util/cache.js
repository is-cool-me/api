// Simple in-memory cache with TTL
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

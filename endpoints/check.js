module.exports = async (req, res) => {
    const fetch = require("node-fetch");

    const domain = req.query.domain;

    if(!domain) return res.status(400).json({ "code": "NO_DOMAIN" });

    const requestTimeout = 5000; // 5 second timeout per request
    const ABORT_ERR_CODE = 20; // DOMException.ABORT_ERR
    
    try {
        // Helper function to create fetch with timeout
        const fetchWithTimeout = async (url) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), requestTimeout);
            
            try {
                const result = await fetch(url, { signal: controller.signal });
                return result;
            } finally {
                clearTimeout(timeoutId);
            }
        };

        // Helper to check if result indicates domain is registered
        const isSuccessfulResult = (result) => {
            return result.status === 'fulfilled' && 
                   result.value && 
                   result.value.status !== 404 && 
                   !result.value.error;
        };

        // Make all three requests in parallel for faster response
        const urls = [
            `https://api.github.com/repos/is-cool-me/register/contents/domains/${domain.toLowerCase()}.json`,
            `https://api.github.com/repos/is-cool-me/register/contents/domains/AorzoHosting/${domain.toLowerCase()}.json`,
            `https://api.github.com/repos/is-cool-me/register/contents/domains/reserved/${domain.toLowerCase()}.json`
        ];

        const results = await Promise.allSettled(
            urls.map(url => fetchWithTimeout(url).then(async (result) => {
                try {
                    const data = await result.json();
                    return { status: result.status, data };
                } catch (jsonErr) {
                    // If JSON parsing fails, treat as error
                    return { status: result.status, data: null, error: jsonErr };
                }
            }).catch(fetchErr => {
                // If fetch fails, return error state
                return { status: 500, data: null, error: fetchErr };
            }))
        );

        // Check if any request succeeded (non-404 response)
        for (const result of results) {
            if (isSuccessfulResult(result)) {
                const data = result.value.data;
                // GitHub API returns {message: "Not Found"} for 404s
                // If data exists and doesn't have error message, domain is registered
                if (data && !data.message) {
                    return res.status(200).json({ "message": "DOMAIN_UNAVAILABLE" });
                }
            }
        }

        // All requests returned 404 or had errors - domain is available
        return res.status(200).json({ "message": "DOMAIN_AVAILABLE" });
    } catch(err) {
        // Check for timeout/abort errors
        if (err.name === 'AbortError' || err.code === ABORT_ERR_CODE) {
            return res.status(504).json({ "error": "Request timeout" });
        }
        console.error('Error checking domain:', err);
        return res.status(500).json({ "error": "Failed to check domain" });
    }
}

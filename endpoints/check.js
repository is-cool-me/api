module.exports = async (req, res) => {
    const fetch = require("node-fetch");

    const domain = req.query.domain;

    if(!domain) return res.status(400).json({ "code": "NO_DOMAIN" });

    let data;

    const requestTimeout = 8000; // 8 second timeout per request
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

        let result = await fetchWithTimeout(`https://api.github.com/repos/is-cool-me/register/contents/domains/${domain.toLowerCase()}.json`);
        data = await result.json();

        if(result.status == 404) {
            result = await fetchWithTimeout(`https://api.github.com/repos/is-cool-me/register/contents/domains/AorzoHosting/${domain.toLowerCase()}.json`);
            data = await result.json();
        }

        if(result.status == 404) {
            result = await fetchWithTimeout(`https://api.github.com/repos/is-cool-me/register/contents/domains/reserved/${domain.toLowerCase()}.json`);
            data = await result.json();
        }
    } catch(err) {
        // Check for timeout/abort errors
        if (err.name === 'AbortError' || err.code === ABORT_ERR_CODE) {
            return res.status(504).json({ "error": "Request timeout" });
        }
        return res.status(500).json({ "error": "Failed to fetch data" });
    }

    if(data && !data.message) return res.status(200).json({ "message": "DOMAIN_UNAVAILABLE" });

    res.status(200).json({ "message": "DOMAIN_AVAILABLE" });
}

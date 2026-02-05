module.exports = async (req, res) => {
    const fetch = require("node-fetch");

    const domain = req.query.domain;

    if(!domain) return res.status(400).json({ "code": "NO_DOMAIN" });

    let data;

    try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        try {
            let result = await fetch(`https://api.github.com/repos/is-cool-me/register/contents/domains/${domain.toLowerCase()}.json`, {
                signal: controller.signal
            });
            data = await result.json();

            if(result.status == 404) {
                result = await fetch(`https://api.github.com/repos/is-cool-me/register/contents/domains/AorzoHosting/${domain.toLowerCase()}.json`, {
                    signal: controller.signal
                });
                data = await result.json();
            }

            if(result.status == 404) {
                result = await fetch(`https://api.github.com/repos/is-cool-me/register/contents/domains/reserved/${domain.toLowerCase()}.json`, {
                    signal: controller.signal
                });
                data = await result.json();
            }
        } finally {
            clearTimeout(timeout);
        }
    } catch(err) {
        if (err.name === 'AbortError') {
            return res.status(504).json({ "error": "Request timeout" });
        }
        return res.status(500).json({ "error": "Failed to fetch data" });
    }

    if(data && !data.message) return res.status(200).json({ "message": "DOMAIN_UNAVAILABLE" });

    res.status(200).json({ "message": "DOMAIN_AVAILABLE" });
}

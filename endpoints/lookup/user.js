module.exports = async (req, res) => {
    const axios = require("axios");

    const email = req.query.email;

    if(!email) return res.status(400).json({ "code": "NO_EMAIL" });

    let data;

    try {
        const result = await axios.get("https://is-cool-me.github.io/raw", {
            timeout: 8000 // 8 second timeout
        });

        data = result.data;
    } catch(err) {
        return res.status(500).json({ "error": "Failed to fetch data" });
    }

    const emailLower = email.toLowerCase();
    const userDomains = [];
    const subdomains = [];
    const domainMap = new Map();

    // Single-pass filtering and processing
    for (const item of data) {
        const itemEmail = item.owner.email.replace(" (at) ", "@").toLowerCase();
        
        if (itemEmail === emailLower) {
            userDomains.push(item);
            subdomains.push(`${item.subdomain.toLowerCase()}.${item.domain.toLowerCase()}`);
            
            // Track domains and their subdomains (use lowercase for consistency)
            const domainLower = item.domain.toLowerCase();
            if (!domainMap.has(domainLower)) {
                domainMap.set(domainLower, {
                    originalCase: item.domain,
                    subdomains: []
                });
            }
            domainMap.get(domainLower).subdomains.push(item.subdomain);
        }
    }

    if(!userDomains.length) return res.status(404).json({ "code": "USER_NOT_FOUND" });

    // Build domains array from map
    const domains = Array.from(domainMap.values()).map(({ originalCase, subdomains: subs }) => ({
        domain: originalCase,
        count: subs.length,
        subdomains: subs
    }));

    return res.status(200).json({
        "count": userDomains.length,
        "domains": domains,
        "subdomains": subdomains
    });
}
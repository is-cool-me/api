module.exports = async (req, res) => {
    const axios = require("axios");

    const domain = req.params.domain.toLowerCase();

    let data;

    try {
        const result = await axios.get("https://is-cool-me.github.io/raw", {
            timeout: 8000 // 8 second timeout
        });

        data = result.data;
    } catch(err) {
        return res.status(500).json({ "error": "Failed to fetch data" });
    }

    const ownerEmailsSet = new Set();
    const subdomains = [];

    // Single-pass filtering and processing
    for (const item of data) {
        if (item.domain === domain) {
            ownerEmailsSet.add(item.owner.email);
            subdomains.push(item.subdomain);
        }
    }

    if(subdomains.length === 0) return res.status(404).json({ "code": "DOMAIN_NOT_FOUND" });

    return res.status(200).json({
        "count": subdomains.length,
        "individual_owners": ownerEmailsSet.size,
        "subdomains": subdomains
    });
}
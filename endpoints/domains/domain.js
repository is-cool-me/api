module.exports = async (req, res) => {
    const { fetchRawData } = require("../../util/fetchRawData");

    const domain = req.params.domain.toLowerCase();

    let data;

    try {
        data = await fetchRawData();
    } catch(err) {
        return res.status(500).json({ "error": "Failed to fetch data" });
    }

    try {
        const ownerEmailsSet = new Set();
        const subdomains = [];

        // Single-pass filtering and processing (case-insensitive domain matching)
        for (const item of data) {
            if (item.domain.toLowerCase() === domain) {
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
    } catch(err) {
        return res.status(500).json({ "error": "Failed to process data" });
    }
}
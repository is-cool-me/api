module.exports = async (req, res) => {
    const { fetchRawData } = require("../util/fetchRawData");

    let data;

    try {
        data = await fetchRawData();
    } catch(err) {
        return res.status(500).json({ "error": "Failed to fetch data" });
    }

    try {
        // Single-pass processing for efficiency
        const ownerEmailsSet = new Set();
        const domainsMap = new Map();
        const recordCounts = {
            A: 0,
            AAAA: 0,
            CNAME: 0,
            MX: 0,
            TXT: 0,
            NS: 0
        };
        const proxiedCounts = {
            true: 0,
            false: 0
        };

        // Process all data in a single pass
        data.forEach(item => {
            // Count unique owners
            const emailLower = item.owner.email.toLowerCase();
            ownerEmailsSet.add(emailLower);

            // Count subdomains per domain (use lowercase key for consistency)
            const domainLower = item.domain.toLowerCase();
            if (!domainsMap.has(domainLower)) {
                domainsMap.set(domainLower, {
                    originalCase: item.domain,
                    count: 0
                });
            }
            domainsMap.get(domainLower).count++;

            // Count record types
            if (item.records.A) recordCounts.A++;
            if (item.records.AAAA) recordCounts.AAAA++;
            if (item.records.CNAME) recordCounts.CNAME++;
            if (item.records.MX) recordCounts.MX++;
            if (item.records.TXT) recordCounts.TXT++;
            if (item.records.NS) recordCounts.NS++;

            // Count proxied status
            if (item.proxied === true) {
                proxiedCounts.true++;
            } else if (item.proxied === false) {
                proxiedCounts.false++;
            }
        });

        // Build domain data array from map
        const domainData = Array.from(domainsMap.values()).map(({ originalCase, count }) => ({
            domain: originalCase,
            subdomains: count
        }));

        return res.status(200).json({
            "subdomains": data.length,
            "individual_owners": ownerEmailsSet.size,
            "domains": domainData,
            "records": recordCounts,
            "proxied": proxiedCounts
        });
    } catch(err) {
        return res.status(500).json({ "error": "Failed to process data" });
    }
}

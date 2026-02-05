module.exports = async (req, res) => {
    const axios = require("axios");

    let data;

    try {
        const result = await axios.get("https://is-cool-me.github.io/raw", {
            timeout: 8000 // 8 second timeout
        });

        data = result.data;
    } catch(err) {
        return res.status(500).json({ "error": "Failed to fetch data" });
    }

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

        // Count subdomains per domain
        const domain = item.domain;
        domainsMap.set(domain, (domainsMap.get(domain) || 0) + 1);

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
    const domainData = Array.from(domainsMap.entries()).map(([domain, count]) => ({
        domain,
        subdomains: count
    }));

    return res.status(200).json({
        "subdomains": data.length,
        "individual_owners": ownerEmailsSet.size,
        "domains": domainData,
        "records": recordCounts,
        "proxied": proxiedCounts
    });
}

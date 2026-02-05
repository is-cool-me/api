module.exports = async (req, res) => {
    const { fetchRawData } = require("../../util/fetchRawData");

    const domain = req.query.domain;

    if(!domain) return res.status(400).json({ "code": "NO_DOMAIN" });

    let data;

    try {
        data = await fetchRawData();
    } catch(err) {
        return res.status(500).json({ "error": "Failed to fetch data" });
    }

    try {
        data = data.filter(item => `${item.subdomain.toLowerCase()}.${item.domain.toLowerCase()}` === domain.toLowerCase());

        if(!data[0]) return res.status(404).json({ "code": "DOMAIN_NOT_FOUND" });

        data = data[0];

        return res.status(200).json(data);
    } catch(err) {
        return res.status(500).json({ "error": "Failed to process data" });
    }
}
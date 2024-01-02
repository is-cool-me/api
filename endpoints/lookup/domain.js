module.exports = async (req, res) => {
    const axios = require("axios");

    const domain = req.query.domain;

    if(!domain) return res.status(400).json({ "code": "NO_DOMAIN" });

    let data;

    try {
        const result = await axios.get("https://is-cool-me.github.io/raw");

        data = result.data;
    } catch(err) {
        return res.status(500);
    }

    data = data.filter(item => `${item.subdomain.toLowerCase()}.${item.domain.toLowerCase()}` === domain.toLowerCase());

    if(!data[0]) return res.status(404).json({ "code": "DOMAIN_NOT_FOUND" });

    data = data[0];

    return res.status(200).json(data);
}
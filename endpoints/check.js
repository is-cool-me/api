module.exports = async (req, res) => {
    const fetch = require("node-fetch");

    const domain = req.query.domain;

    if(!domain) return res.status(400).json({ "code": "NO_DOMAIN" });

    let data;

    try {
        const result = await fetch(`https://api.github.com/repos/is-cool-me/register/contents/domains/${domain.toLowerCase()}.json`);

        data = result;
    } catch(err) {
        return res.status(500);
    }

    if(data.status == 404) return res.status(200).json({ "message": "DOMAIN_AVAILABLE" });

    res.status(200).json({ "message": "DOMAIN_UNAVAILABLE" });
}
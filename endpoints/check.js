module.exports = async (req, res) => {
    const fetch = require("node-fetch");

    const domain = req.query.domain;

    if(!domain) return res.status(400).json({ "code": "NO_DOMAIN" });

    let data;

    try {
        // Check if file exists in the 'domains' folder
        let result = await fetch(`https://api.github.com/repos/is-cool-me/register/contents/domains/${domain.toLowerCase()}.json`);
        data = await result.json();

        if(result.status == 404) {
            // If file not found in 'domains' folder, check in 'domains/AorzoHosting' folder
            result = await fetch(`https://api.github.com/repos/is-cool-me/register/contents/domains/AorzoHosting/${domain.toLowerCase()}.json`);
            data = await result.json();
        }
    } catch(err) {
        return res.status(500);
    }

    if(data && !data.message) return res.status(200).json({ "message": "DOMAIN_UNAVAILABLE" });

    res.status(200).json({ "message": "DOMAIN_AVAILABLE" });
}

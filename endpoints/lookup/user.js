module.exports = async (req, res) => {
    const axios = require("axios");

    const email = req.query.email;

    if(!email) return res.status(400).json({ "code": "NO_EMAIL" });

    let data;

    try {
        const result = await axios.get("https://is-cool-me.github.io/raw");

        data = result.data;
    } catch(err) {
        return res.status(500);
    }

    const userDomains = data.filter(item => item.owner.email.replace(" (at) ", "@").toLowerCase() === email.toLowerCase());

    if(!userDomains.length) return res.status(404).json({ "code": "USER_NOT_FOUND" });

    let subdomains = [];

    userDomains.forEach(item => {
        subdomains.push(`${item.subdomain.toLowerCase()}.${item.domain.toLowerCase()}`);
    })

    const domains = [];
    const checkedDomains = [];

    data.forEach(item => {
        if(checkedDomains.includes(item.domain.toLowerCase())) return;

        checkedDomains.push(item.domain.toLowerCase());

        let domain = userDomains.filter(i => i.domain.toLowerCase() === item.domain.toLowerCase());

        const itemSubdomains = [];

        domain.forEach(d => {
            itemSubdomains.push(d.subdomain);
        })

        domains.push({"domain":item.domain,"count":domain.length,"subdomains":itemSubdomains});
    })

    return res.status(200).json({
        "count": userDomains.length,
        "domains": domains,
        "subdomains": subdomains
    })
}
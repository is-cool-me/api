module.exports = async (req, res) => {
    const axios = require("axios");

    let data;

    try {
        const result = await axios.get("https://is-cool-me.github.io/raw");

        data = result.data;
    } catch(err) {
        return res.status(500);
    }

    return res.status(200).send(data);
}
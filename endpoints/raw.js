module.exports = async (req, res) => {
    const { fetchRawData } = require("../util/fetchRawData");

    let data;

    try {
        data = await fetchRawData();
    } catch(err) {
        return res.status(500).json({ "error": "Failed to fetch data" });
    }

    return res.status(200).send(data);
}
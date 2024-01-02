module.exports = {
    "check": require("../endpoints/check"),
    "count": require("../endpoints/count"),
    "domains": {
        "domain": require("../endpoints/domains/domain")
    },
    "index": require("../endpoints/index"),
    "lookup": {
        "domain": require("../endpoints/lookup/domain"),
        "user": require("../endpoints/lookup/user")
    },
    "raw": require("../endpoints/raw")
}
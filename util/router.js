const { Router } = require("express");

const router = Router();
const routes = require("./routes");

router.get("/", async (req, res) => {
    routes.index(req, res);
})

router.get("/check", async (req, res) => {
    routes.check(req, res);
})

router.get("/count", async (req, res) => {
    routes.count(req, res);
})

router.get("/domains/:domain", async (req, res) => {
    routes.domains.domain(req, res);
})

router.get("/lookup/domain", async (req, res) => {
    routes.lookup.domain(req, res);
})

router.get("/lookup/user", async (req, res) => {
    routes.lookup.user(req, res);
})

router.get("/raw", async (req, res) => {
    routes.raw(req, res);
})

module.exports = router;
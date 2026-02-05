const { Router } = require("express");

const router = Router();
const routes = require("./routes");

router.get("/", async (req, res) => {
    await routes.index(req, res);
})

router.get("/check", async (req, res) => {
    await routes.check(req, res);
})

router.get("/count", async (req, res) => {
    await routes.count(req, res);
})

router.get("/domains/:domain", async (req, res) => {
    await routes.domains.domain(req, res);
})

router.get("/lookup/domain", async (req, res) => {
    await routes.lookup.domain(req, res);
})

router.get("/lookup/user", async (req, res) => {
    await routes.lookup.user(req, res);
})

router.get("/raw", async (req, res) => {
    await routes.raw(req, res);
})

module.exports = router;
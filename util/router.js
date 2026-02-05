const { Router } = require("express");

const router = Router();
const routes = require("./routes");

router.get("/", async (req, res, next) => {
    try {
        await routes.index(req, res);
    } catch (err) {
        next(err);
    }
})

router.get("/check", async (req, res, next) => {
    try {
        await routes.check(req, res);
    } catch (err) {
        next(err);
    }
})

router.get("/count", async (req, res, next) => {
    try {
        await routes.count(req, res);
    } catch (err) {
        next(err);
    }
})

router.get("/domains/:domain", async (req, res, next) => {
    try {
        await routes.domains.domain(req, res);
    } catch (err) {
        next(err);
    }
})

router.get("/lookup/domain", async (req, res, next) => {
    try {
        await routes.lookup.domain(req, res);
    } catch (err) {
        next(err);
    }
})

router.get("/lookup/user", async (req, res, next) => {
    try {
        await routes.lookup.user(req, res);
    } catch (err) {
        next(err);
    }
})

router.get("/raw", async (req, res, next) => {
    try {
        await routes.raw(req, res);
    } catch (err) {
        next(err);
    }
})

module.exports = router;
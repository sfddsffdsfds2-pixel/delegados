const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth");
const session = require("../controllers/session.controller");

router.get("/api/me", requireAuth, session.me);

module.exports = router;

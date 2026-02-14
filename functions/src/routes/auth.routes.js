const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { registerSchema } = require("../schemas/auth.schema");
const auth = require("../controllers/auth.controller");

router.post("/api/register", requireAuth, validate(registerSchema), auth.register);

module.exports = router;

const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const { delegadoSchema } = require("../schemas/delegados.schema");
const delegados = require("../controllers/delegados.controller");

router.post("/api/delegados/register", requireAuth, validate(delegadoSchema), delegados.registerDelegado);
router.get("/api/delegados/me", requireAuth, delegados.meDelegado);

module.exports = router;

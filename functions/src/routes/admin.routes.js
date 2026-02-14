const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth");
const { requireRole } = require("../middlewares/roles");
const { validate } = require("../middlewares/validate");
const { createUserSchema, updateUserRoleSchema } = require("../schemas/admin.schema");
const adminCtrl = require("../controllers/admin.controller");

router.post("/api/bootstrap/superadmin", adminCtrl.bootstrapSuperadmin);

router.post("/api/admin/users", requireAuth, requireRole(["super_admin", "admin"]), validate(createUserSchema), adminCtrl.createUser);
router.get("/api/admin/users", requireAuth, requireRole(["super_admin", "admin"]), adminCtrl.listUsers);
router.patch("/api/admin/users/:uid", requireAuth, requireRole(["super_admin", "admin"]), validate(updateUserRoleSchema), adminCtrl.updateUser);

module.exports = router;

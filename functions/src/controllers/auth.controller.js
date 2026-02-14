const { toInternalEmail } = require("../utils/internalEmail");
const { upsertUserRole } = require("../services/roles.service");

async function register(req, res) {
  try {
    const { username } = req.body;

    const expectedEmail = toInternalEmail(username);
    if ((req.user.email || "").toLowerCase() !== expectedEmail.toLowerCase()) {
      return res.status(400).json({ ok: false, error: "Username does not match authenticated user" });
    }

    await upsertUserRole(req.user.uid, {
      role: null,
      recintoId: null,
      email: req.user.email || expectedEmail,
      username,
      status: "active",
      createdAt: require("../config/firebase").serverTimestamp(),
    });

    return res.json({ ok: true, uid: req.user.uid });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Register failed" });
  }
}

module.exports = { register };

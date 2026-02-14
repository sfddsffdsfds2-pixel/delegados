const { toInternalEmail } = require("../utils/internalEmail");
const { createAuthUser, setClaims } = require("../services/users.service");
const { upsertUserRole, superAdminExists } = require("../services/roles.service");
const { admin, db } = require("../config/firebase");

async function bootstrapSuperadmin(req, res) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, error: "Missing Bearer token" });

    const decoded = await admin.auth().verifyIdToken(token);

    if (await superAdminExists()) {
      return res.status(403).json({ ok: false, error: "Bootstrap already done" });
    }

    await setClaims(decoded.uid, { role: "super_admin", recintoId: null });
    await upsertUserRole(decoded.uid, {
      role: "super_admin",
      recintoId: null,
      email: decoded.email || null,
    });

    return res.json({ ok: true, uid: decoded.uid, role: "super_admin" });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Bootstrap failed" });
  }
}

async function createUser(req, res) {
  try {
    const { username, password, role, recintoId } = req.body;
    const email = toInternalEmail(username);

    const user = await createAuthUser({ email, password });

    await setClaims(user.uid, { role, recintoId: recintoId || null });
    await upsertUserRole(user.uid, {
      role,
      recintoId: recintoId || null,
      email,
      username,
    });

    return res.json({ ok: true, uid: user.uid, email, role, recintoId: recintoId || null });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Failed to create user" });
  }
}

async function listUsers(_req, res) {
  try {
    const snap = await db.collection("user_roles").orderBy("updatedAt", "desc").limit(200).get();
    const items = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    return res.json({ ok: true, items });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Failed to list users" });
  }
}

async function updateUser(req, res) {
  const uid = req.params.uid;

  try {
    const ref = db.collection("user_roles").doc(uid);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ ok: false, error: "User not found in user_roles" });

    const current = doc.data() || {};
    const nextRole = req.body.role ?? current.role ?? null;
    const nextRecintoId = req.body.recintoId !== undefined ? req.body.recintoId : current.recintoId ?? null;

    if (nextRole === "jefe_recinto" && !nextRecintoId) {
      return res.status(400).json({ ok: false, error: "recintoId is required for jefe_recinto" });
    }

    await setClaims(uid, { role: nextRole, recintoId: nextRecintoId || null });
    await upsertUserRole(uid, { role: nextRole, recintoId: nextRecintoId || null });

    return res.json({ ok: true, uid, role: nextRole, recintoId: nextRecintoId || null });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Failed to update user" });
  }
}

module.exports = { bootstrapSuperadmin, createUser, listUsers, updateUser };

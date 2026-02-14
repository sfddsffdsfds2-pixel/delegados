const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const express = require("express");
const cors = require("cors");
const { z } = require("zod");

admin.initializeApp();
const db = admin.firestore();

const serverTimestamp = FieldValue.serverTimestamp;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

/** =========================
 *  Health
 *  ========================= */
app.get("/api/health", (_req, res) => res.json({ ok: true }));

/** =========================
 *  Auth / Roles helpers
 *  ========================= */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, error: "Missing Bearer token" });

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      role: decoded.role || null,
      recintoId: decoded.recintoId || null,
    };

    next();
  } catch (_e) {
    return res.status(401).json({ ok: false, error: "Invalid or expired token" });
  }
}

function requireRole(allowed) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ ok: false, error: "Forbidden (role)" });
    }
    next();
  };
}

function toInternalEmail(username) {
  const clean = String(username).trim().toLowerCase();
  return `${clean}@tuapp.local`;
}

function normalizeText(s) {
  return String(s || "")
    .trim()
    .replace(/\s+/g, " ");
}

/** =========================
 *  Session
 *  ========================= */
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

/** =========================
 *  Auth Register (perfil básico)
 *  ========================= */
const registerSchema = z.object({
  username: z.string().min(3).max(50),
});

app.post("/api/register", requireAuth, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }

  try {
    const { username } = parsed.data;

    const expectedEmail = toInternalEmail(username);
    if ((req.user.email || "").toLowerCase() !== expectedEmail.toLowerCase()) {
      return res.status(400).json({
        ok: false,
        error: "Username does not match authenticated user",
      });
    }

    await db.collection("user_roles").doc(req.user.uid).set(
      {
        role: null,
        recintoId: null,
        email: req.user.email || expectedEmail,
        username,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return res.json({ ok: true, uid: req.user.uid });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Register failed" });
  }
});

/** =========================
 *  Bootstrap superadmin (solo 1 vez)
 *  ========================= */
app.post("/api/bootstrap/superadmin", async (req, res) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ ok: false, error: "Missing Bearer token" });

    const decoded = await admin.auth().verifyIdToken(token);

    const snap = await db.collection("user_roles").where("role", "==", "super_admin").limit(1).get();

    if (!snap.empty) {
      return res.status(403).json({ ok: false, error: "Bootstrap already done" });
    }

    await admin.auth().setCustomUserClaims(decoded.uid, { role: "super_admin", recintoId: null });

    await db.collection("user_roles").doc(decoded.uid).set(
      {
        role: "super_admin",
        recintoId: null,
        email: decoded.email || null,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return res.json({ ok: true, uid: decoded.uid, role: "super_admin" });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Bootstrap failed" });
  }
});

/** =========================
 *  Admin users: create/list/update roles
 *  ========================= */
const createUserSchema = z
  .object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
    role: z.enum(["super_admin", "admin", "jefe_recinto"]),
    recintoId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "jefe_recinto" && !data.recintoId) {
      ctx.addIssue({ code: "custom", message: "recintoId is required for jefe_recinto" });
    }
  });

const updateUserRoleSchema = z
  .object({
    role: z.enum(["super_admin", "admin", "jefe_recinto"]).optional(),
    recintoId: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "jefe_recinto" && (data.recintoId === null || data.recintoId === undefined)) {
      ctx.addIssue({ code: "custom", message: "recintoId is required for jefe_recinto" });
    }
  });

app.post("/api/admin/users", requireAuth, requireRole(["super_admin", "admin"]), async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }

  const { username, password, role, recintoId } = parsed.data;
  const email = toInternalEmail(username);

  try {
    const user = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false,
    });

    await admin.auth().setCustomUserClaims(user.uid, {
      role,
      recintoId: recintoId || null,
    });

    await db.collection("user_roles").doc(user.uid).set(
      {
        role,
        recintoId: recintoId || null,
        email,
        username,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return res.json({ ok: true, uid: user.uid, email, role, recintoId: recintoId || null });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Failed to create user" });
  }
});

app.get("/api/admin/users", requireAuth, requireRole(["super_admin", "admin"]), async (_req, res) => {
  try {
    const snap = await db.collection("user_roles").orderBy("updatedAt", "desc").limit(200).get();
    const items = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
    return res.json({ ok: true, items });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Failed to list users" });
  }
});

app.patch("/api/admin/users/:uid", requireAuth, requireRole(["super_admin", "admin"]), async (req, res) => {
  const uid = req.params.uid;

  const parsed = updateUserRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }

  try {
    const ref = db.collection("user_roles").doc(uid);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ ok: false, error: "User not found in user_roles" });

    const current = doc.data() || {};
    const nextRole = parsed.data.role ?? current.role ?? null;
    const nextRecintoId =
      parsed.data.recintoId !== undefined ? parsed.data.recintoId : current.recintoId ?? null;

    if (nextRole === "jefe_recinto" && !nextRecintoId) {
      return res.status(400).json({ ok: false, error: "recintoId is required for jefe_recinto" });
    }

    await admin.auth().setCustomUserClaims(uid, {
      role: nextRole,
      recintoId: nextRecintoId || null,
    });

    await ref.set(
      {
        role: nextRole,
        recintoId: nextRecintoId || null,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return res.json({ ok: true, uid, role: nextRole, recintoId: nextRecintoId || null });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "Failed to update user" });
  }
});

/** =========================
 *  Delegados (colección "delegados")
 *  - Guarda SOLO: nombre, apellido, ci, telefono, distrito
 *  - Requiere auth (token)
 *  - Evita CI duplicado (si ya existe en otro UID)
 *  ========================= */
const delegadoSchema = z.object({
  nombre: z.string().trim().min(2).max(60),
  apellido: z.string().trim().min(2).max(60),
  ci: z.string().trim().min(4).max(12).regex(/^[0-9]+$/, "CI debe ser numérico"),
  telefono: z.string().trim().min(7).max(15).regex(/^[0-9+]+$/, "Teléfono inválido"),
  distrito: z.string().trim().min(2).max(80),
});

app.post("/api/delegados/register", requireAuth, async (req, res) => {
  const parsed = delegadoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.flatten() });
  }

  try {
    const nombre = normalizeText(parsed.data.nombre);
    const apellido = normalizeText(parsed.data.apellido);
    const ci = normalizeText(parsed.data.ci);
    const telefono = normalizeText(parsed.data.telefono);
    const distrito = normalizeText(parsed.data.distrito);

    const existing = await db.collection("delegados").where("ci", "==", ci).limit(1).get();
    if (!existing.empty) {
      const doc = existing.docs[0];
      if (doc.id !== req.user.uid) {
        return res.status(409).json({ ok: false, error: "Este CI ya está registrado" });
      }
    }

    await db.collection("delegados").doc(req.user.uid).set(
      {
        nombre,
        apellido,
        ci,
        telefono,
        distrito,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    return res.json({ ok: true, uid: req.user.uid });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "No se pudo registrar delegado" });
  }
});

app.get("/api/delegados/me", requireAuth, async (req, res) => {
  try {
    const doc = await db.collection("delegados").doc(req.user.uid).get();
    if (!doc.exists) return res.status(404).json({ ok: false, error: "Delegado no encontrado" });
    return res.json({ ok: true, data: doc.data() });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "No se pudo obtener delegado" });
  }
});

exports.api = onRequest(app);

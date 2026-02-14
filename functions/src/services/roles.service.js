const { db, serverTimestamp } = require("../config/firebase");

async function upsertUserRole(uid, data) {
  await db.collection("user_roles").doc(uid).set(
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function superAdminExists() {
  const snap = await db.collection("user_roles").where("role", "==", "super_admin").limit(1).get();
  return !snap.empty;
}

module.exports = { upsertUserRole, superAdminExists };

const { db, serverTimestamp } = require("../config/firebase");

async function ensureCiNotTaken(ci, uid) {
  const existing = await db.collection("delegados").where("ci", "==", ci).limit(1).get();
  if (existing.empty) return;

  const doc = existing.docs[0];
  if (doc.id !== uid) {
    const err = new Error("Este CI ya está registrado");
    err.status = 409;
    throw err;
  }
}

async function upsertDelegado(uid, data) {
  await db.collection("delegados").doc(uid).set(
    {
      ...data,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function getDelegado(uid) {
  const doc = await db.collection("delegados").doc(uid).get();
  if (!doc.exists) return null;
  return doc.data();
}

module.exports = { ensureCiNotTaken, upsertDelegado, getDelegado };

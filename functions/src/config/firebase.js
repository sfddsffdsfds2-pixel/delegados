const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

admin.initializeApp();

const db = admin.firestore();
const serverTimestamp = FieldValue.serverTimestamp;

module.exports = { admin, db, serverTimestamp };

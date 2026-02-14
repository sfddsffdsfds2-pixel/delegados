const { admin } = require("../config/firebase");

async function createAuthUser({ email, password }) {
  return admin.auth().createUser({
    email,
    password,
    emailVerified: false,
    disabled: false,
  });
}

async function setClaims(uid, claims) {
  return admin.auth().setCustomUserClaims(uid, claims);
}

module.exports = { createAuthUser, setClaims };

function toInternalEmail(username) {
  const clean = String(username).trim().toLowerCase();
  return `${clean}@tuapp.local`;
}

module.exports = { toInternalEmail };

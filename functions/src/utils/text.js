function normalizeText(s) {
  return String(s || "")
    .trim()
    .replace(/\s+/g, " ");
}

module.exports = { normalizeText };

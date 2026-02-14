function me(req, res) {
  res.json({ ok: true, user: req.user });
}

module.exports = { me };

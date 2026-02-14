function requireRole(allowed) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ ok: false, error: "Forbidden (role)" });
    }
    next();
  };
}

module.exports = { requireRole };

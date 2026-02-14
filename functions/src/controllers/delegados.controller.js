const { normalizeText } = require("../utils/text");
const { ensureCiNotTaken, upsertDelegado, getDelegado } = require("../services/delegados.service");

async function registerDelegado(req, res) {
  try {
    const nombre = normalizeText(req.body.nombre);
    const apellido = normalizeText(req.body.apellido);
    const ci = normalizeText(req.body.ci);
    const telefono = normalizeText(req.body.telefono);
    const distrito = normalizeText(req.body.distrito);

    await ensureCiNotTaken(ci, req.user.uid);

    await upsertDelegado(req.user.uid, {
      nombre,
      apellido,
      ci,
      telefono,
      distrito,
    });

    return res.json({ ok: true, uid: req.user.uid });
  } catch (e) {
    const status = e?.status || 400;
    return res.status(status).json({ ok: false, error: e?.message || "No se pudo registrar delegado" });
  }
}

async function meDelegado(req, res) {
  try {
    const data = await getDelegado(req.user.uid);
    if (!data) return res.status(404).json({ ok: false, error: "Delegado no encontrado" });
    return res.json({ ok: true, data });
  } catch (e) {
    return res.status(400).json({ ok: false, error: e?.message || "No se pudo obtener delegado" });
  }
}

module.exports = { registerDelegado, meDelegado };

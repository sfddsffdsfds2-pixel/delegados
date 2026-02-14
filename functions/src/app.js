const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const sessionRoutes = require("./routes/session.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const delegadosRoutes = require("./routes/delegados.routes");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use(healthRoutes);
app.use(sessionRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(delegadosRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: "Internal error" });
});

module.exports = { app };

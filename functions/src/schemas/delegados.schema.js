const { z } = require("zod");

const delegadoSchema = z.object({
  nombre: z.string().trim().min(2).max(60),
  apellido: z.string().trim().min(2).max(60),
  ci: z.string().trim().min(4).max(12).regex(/^[0-9]+$/, "CI debe ser numérico"),
  telefono: z.string().trim().min(7).max(15).regex(/^[0-9+]+$/, "Teléfono inválido"),
  distrito: z.string().trim().min(2).max(80),
});

module.exports = { delegadoSchema };

const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().min(3).max(50),
});

module.exports = { registerSchema };

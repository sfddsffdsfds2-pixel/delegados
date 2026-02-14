const { z } = require("zod");

const createUserSchema = z
  .object({
    username: z.string().min(3).max(50),
    password: z.string().min(6).max(100),
    role: z.enum(["super_admin", "admin", "jefe_recinto"]),
    recintoId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "jefe_recinto" && !data.recintoId) {
      ctx.addIssue({ code: "custom", message: "recintoId is required for jefe_recinto" });
    }
  });

const updateUserRoleSchema = z
  .object({
    role: z.enum(["super_admin", "admin", "jefe_recinto"]).optional(),
    recintoId: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "jefe_recinto" && (data.recintoId === null || data.recintoId === undefined)) {
      ctx.addIssue({ code: "custom", message: "recintoId is required for jefe_recinto" });
    }
  });

module.exports = { createUserSchema, updateUserRoleSchema };

import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must have at least 6 characters" })
    .max(30, { message: "Password must have at most 30 characters" }),
  rememberMe: z.boolean(),
});

import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(50, { message: "Name must have at most 50 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must have at least 6 characters" })
    .max(30, { message: "Password must have at most 30 characters" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must have at least 10 characters" })
    .max(15, { message: "Phone number must have at most 15 characters" }),
});

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must have at least 6 characters" })
    .max(30, { message: "Password must have at most 30 characters" }),
  rememberMe: z.boolean(),
});

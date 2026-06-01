import { z } from "zod"

const usernameSchema = z
  .string({ error: "Username is required" })
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can contain only letters, numbers and underscores"
  )

const emailSchema = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Email must be valid")
  .max(255, "Email must be at most 255 characters")

const passwordSchema = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")

export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .strict()

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string({ error: "Password is required" }).min(1, "Password is required"),
  })
  .strict()

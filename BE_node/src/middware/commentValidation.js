import { z } from "zod"

const positiveIdSchema = z
  .string({ error: "Recipe id is required" })
  .trim()
  .regex(/^\d+$/, "Recipe id must be a positive number")
  .transform(Number)
  .refine((value) => value > 0, "Recipe id must be positive")

export const commentRecipeParamsSchema = z
  .object({
    recipeId: positiveIdSchema,
  })
  .strict()

export const commentIdParamsSchema = z
  .object({
    id: positiveIdSchema,
  })
  .strict()

export const createCommentSchema = z
  .object({
    content: z
      .string({ error: "Comment content is required" })
      .trim()
      .min(1, "Comment content cannot be empty")
      .max(1000, "Comment content must be at most 1000 characters"),
    rating: z
      .number({ error: "Rating is required" })
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
  })
  .strict()

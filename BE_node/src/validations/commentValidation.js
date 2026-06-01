import { z } from "zod"
import { positiveIdParamSchema } from "./commonSchemas.js"

export const commentRecipeParamsSchema = z
  .object({
    recipeId: positiveIdParamSchema("Recipe id"),
  })
  .strict()

export const commentIdParamsSchema = z
  .object({
    id: positiveIdParamSchema("Comment id"),
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

import { z } from "zod"

const recipeIdSchema = z
  .string({ error: "Recipe id is required" })
  .trim()
  .regex(/^\d+$/, "Recipe id must be a positive number")
  .transform(Number)
  .refine((value) => value > 0, "Recipe id must be positive")

export const favoriteRecipeParamsSchema = z
  .object({
    recipeId: recipeIdSchema,
  })
  .strict()

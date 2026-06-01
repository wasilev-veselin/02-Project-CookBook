import { z } from "zod"
import { positiveIdParamSchema } from "./commonSchemas.js"

export const favoriteRecipeParamsSchema = z
  .object({
    recipeId: positiveIdParamSchema("Recipe id"),
  })
  .strict()

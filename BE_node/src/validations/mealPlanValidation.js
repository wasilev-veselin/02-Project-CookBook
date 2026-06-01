import { z } from "zod"
import {
  dateStringSchema,
  mealTypeSchema,
  positiveIdParamSchema,
  recipeIdBodySchema,
} from "./commonSchemas.js"

export const mealPlanDateQuerySchema = z
  .object({
    date: dateStringSchema,
  })
  .strict()

export const mealPlanIdParamsSchema = z
  .object({
    id: positiveIdParamSchema("Id"),
  })
  .strict()

export const updateMealPlanSchema = z
  .object({
    date: dateStringSchema.optional(),
    mealType: mealTypeSchema.optional(),
    recipeId: recipeIdBodySchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })

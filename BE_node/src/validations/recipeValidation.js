import { z } from "zod"
import {
  difficultySchema,
  nonEmptyTrimmedStringSchema,
  optionalString,
  positiveIdParamSchema,
  positiveIntQuerySchema,
} from "./commonSchemas.js"

const recipeTypeSchema = nonEmptyTrimmedStringSchema({
  fieldName: "Type",
  max: 50,
  invalidPattern: /^[\p{L}\p{N}\s_-]+$/u,
  invalidPatternMessage: "Type contains invalid characters",
})

const ingredientSchema = nonEmptyTrimmedStringSchema({
  fieldName: "Ingredient",
  max: 50,
  invalidPattern: /^[\p{L}\p{N}\s'-]+$/u,
  invalidPatternMessage: "Ingredient contains invalid characters",
})

const ingredientsQuerySchema = z.preprocess((value) => {
  if (value === undefined) {
    return undefined
  }

  const values = Array.isArray(value) ? value : [value]

  return values
    .flatMap((item) => String(item).split(","))
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
}, z.array(ingredientSchema).max(20, "Use at most 20 ingredients").optional())

export const catalogRecipeQuerySchema = z
  .object({
    difficulty: optionalString(difficultySchema),
    cookingTime: optionalString(positiveIntQuerySchema("Cooking time")),
    ingredients: ingredientsQuerySchema,
    type: optionalString(recipeTypeSchema),
    search: optionalString(nonEmptyTrimmedStringSchema()),
  })
  .strict()

export const recipeIdParamsSchema = z
  .object({
    id: positiveIdParamSchema("Recipe id"),
  })
  .strict()

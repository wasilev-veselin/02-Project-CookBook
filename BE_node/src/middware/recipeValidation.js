import { z } from "zod"

const textFilterSchema = z
  .string()
  .trim()
  .min(1, "Value cannot be empty")
  .max(100, "Value must be at most 100 characters")

const recipeTypeSchema = z
  .string()
  .trim()
  .min(1, "Type cannot be empty")
  .max(50, "Type must be at most 50 characters")
  .regex(/^[\p{L}\p{N}\s_-]+$/u, "Type contains invalid characters")

const ingredientSchema = z
  .string()
  .trim()
  .min(1, "Ingredient cannot be empty")
  .max(50, "Ingredient must be at most 50 characters")
  .regex(/^[\p{L}\p{N}\s'-]+$/u, "Ingredient contains invalid characters")

const optionalString = (schema) =>
  z.preprocess((value) => {
    if (value === undefined) {
      return undefined
    }

    if (Array.isArray(value)) {
      return value[0]
    }

    return value
  }, schema.optional())

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
    difficulty: optionalString(
      z
        .string()
        .trim()
        .toUpperCase()
        .pipe(z.enum(["EASY", "MEDIUM", "HARD"], { error: "Invalid difficulty" }))
    ),
    cookingTime: optionalString(
      z
        .string()
        .trim()
        .regex(/^\d+$/, "Cooking time must be a positive number")
        .transform(Number)
        .refine((value) => value > 0, "Cooking time must be positive")
    ),
    ingredients: ingredientsQuerySchema,
    type: optionalString(recipeTypeSchema),
    search: optionalString(textFilterSchema),
  })
  .strict()

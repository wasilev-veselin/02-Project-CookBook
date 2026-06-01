import { z } from "zod"

export const positiveIdParamSchema = (fieldName = "Id") =>
  z
    .string({ error: `${fieldName} is required` })
    .trim()
    .regex(/^\d+$/, `${fieldName} must be a positive number`)
    .transform(Number)
    .refine((value) => value > 0, `${fieldName} must be positive`)

export const dateStringSchema = z
  .string({ error: "Date is required" })
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")

export const recipeIdBodySchema = z
  .number({ error: "Recipe id is required" })
  .int("Recipe id must be an integer")
  .positive("Recipe id must be positive")

export const nonEmptyTrimmedStringSchema = ({
  fieldName = "Value",
  max = 100,
  invalidPattern,
  invalidPatternMessage,
} = {}) => {
  let schema = z
    .string()
    .trim()
    .min(1, `${fieldName} cannot be empty`)
    .max(max, `${fieldName} must be at most ${max} characters`)

  if (invalidPattern) {
    schema = schema.regex(invalidPattern, invalidPatternMessage)
  }

  return schema
}

export const difficultySchema = z
  .string()
  .trim()
  .toUpperCase()
  .pipe(z.enum(["EASY", "MEDIUM", "HARD"], { error: "Invalid difficulty" }))

export const mealTypeSchema = z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"])

export const positiveIntQuerySchema = (fieldName) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, `${fieldName} must be a positive number`)
    .transform(Number)
    .refine((value) => value > 0, `${fieldName} must be positive`)

export const optionalString = (schema) =>
  z.preprocess((value) => {
    if (value === undefined) {
      return undefined
    }

    if (Array.isArray(value)) {
      return value[0]
    }

    return value
  }, schema.optional())

import { z } from "zod";

const positiveIdSchema = z
  .string({ error: "Id is required" })
  .trim()
  .regex(/^\d+$/, "Id must be a positive number")
  .transform(Number)
  .refine((value) => value > 0, "Id must be positive")

const dateSchema = z
  .string({ error: "Date is required" })
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")

const recipeIdBodySchema = z
  .number({ error: "Recipe id is required" })
  .int("Recipe id must be an integer")
  .positive("Recipe id must be positive")

export const mealPlanDateQuerySchema = z
  .object({
    date: dateSchema,
  })
  .strict();

export const mealPlanIdParamsSchema = z
  .object({
    id: positiveIdSchema,
  })
  .strict()

export const updateMealPlanSchema = z
  .object({
    date: dateSchema.optional(),
    mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]).optional(),
    recipeId: recipeIdBodySchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })

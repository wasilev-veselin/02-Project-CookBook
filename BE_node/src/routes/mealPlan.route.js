import { Router } from "express";
import { deleteMealPlan, getMealPlanByDate, updateMealPlan } from "../controler/mealPlan.controler.js";
import { protectRoute } from "../middware/auth.middleware.js";
import {
  mealPlanDateQuerySchema,
  mealPlanIdParamsSchema,
  updateMealPlanSchema,
} from "../middware/mealPlanValidation.js";
import { validateBody } from "../middware/validateBody.js";
import { validateParams } from "../middware/validateParams.js";
import { validateQuery } from "../middware/validateQuery.js";

export const mealPlanRouter = Router();

mealPlanRouter.use(protectRoute);

mealPlanRouter.get("/", validateQuery(mealPlanDateQuerySchema), getMealPlanByDate);
mealPlanRouter.put(
  "/:id",
  validateParams(mealPlanIdParamsSchema),
  validateBody(updateMealPlanSchema),
  updateMealPlan
);
mealPlanRouter.delete(
  "/:id",
  validateParams(mealPlanIdParamsSchema),
  deleteMealPlan
);

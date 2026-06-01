import { Router } from "express";
import { deleteMealPlan, getMealPlanByDate, updateMealPlan } from "../controllers/mealPlan.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  mealPlanDateQuerySchema,
  mealPlanIdParamsSchema,
  updateMealPlanSchema,
} from "../validations/mealPlanValidation.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateParams } from "../middleware/validateParams.js";
import { validateQuery } from "../middleware/validateQuery.js";

export const mealPlanRouter = Router();

mealPlanRouter.use(protectRoute);

mealPlanRouter.get("/", validateQuery(mealPlanDateQuerySchema), getMealPlanByDate);
mealPlanRouter.patch(
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

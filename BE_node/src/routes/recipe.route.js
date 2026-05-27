import { Router } from "express";
import { catalogRecipe, getRecipeById } from "../controler/recipe.controler.js";
import { validateQuery } from "../middware/validateQuery.js";
import { catalogRecipeQuerySchema, recipeIdParamsSchema } from "../middware/recipeValidation.js";
import { validateParams } from "../middware/validateParams.js";

export const recipeRouter = Router();

recipeRouter.get("/catalogRecipe", validateQuery(catalogRecipeQuerySchema), catalogRecipe);
recipeRouter.get("/:id", validateParams(recipeIdParamsSchema), getRecipeById);

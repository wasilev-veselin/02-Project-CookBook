import { Router } from "express";
import { catalogRecipe, getRecipeById } from "../controler/recipe.controler.js";
import { validateCatalogQuery } from "../middware/validateQuery.js";
import { catalogRecipeQuerySchema } from "../middware/recipeValidation.js";

export const recipeRouter = Router();

recipeRouter.get("/catalogRecipe", validateCatalogQuery(catalogRecipeQuerySchema), catalogRecipe);
recipeRouter.get("/:id", getRecipeById);

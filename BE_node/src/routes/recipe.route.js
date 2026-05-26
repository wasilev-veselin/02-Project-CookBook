import { Router } from "express";
import { catalogRecipe, getRecipeById } from "../controler/recipe.controler.js";

export const recipeRouter = Router();

recipeRouter.get("/catalogRecipe", catalogRecipe);
recipeRouter.get("/:id", getRecipeById);

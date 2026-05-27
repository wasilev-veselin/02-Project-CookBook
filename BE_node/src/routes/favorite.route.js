import { Router } from "express"
import {
  addFavoriteRecipe,
  getFavoriteRecipes,
  removeFavoriteRecipe,
} from "../controler/favorite.controler.js"
import { protectRoute } from "../middware/auth.middleware.js"
import { favoriteRecipeParamsSchema } from "../middware/favoriteValidation.js"
import { validateParams } from "../middware/validateParams.js"

export const favoriteRouter = Router()

favoriteRouter.use(protectRoute)

favoriteRouter.get("/", getFavoriteRecipes)

favoriteRouter.post("/:recipeId",
  validateParams(favoriteRecipeParamsSchema),
  addFavoriteRecipe
)

favoriteRouter.delete("/:recipeId",
  validateParams(favoriteRecipeParamsSchema),
  removeFavoriteRecipe
)

import { Router } from "express"
import {
  addFavoriteRecipe,
  getFavoriteRecipes,
  removeFavoriteRecipe,
} from "../controllers/favorite.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { favoriteRecipeParamsSchema } from "../validations/favoriteValidation.js"
import { validateParams } from "../middleware/validateParams.js"

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

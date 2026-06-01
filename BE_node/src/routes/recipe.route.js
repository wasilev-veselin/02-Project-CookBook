import { Router } from "express";
import { createComment } from "../controllers/comment.controller.js"
import { catalogRecipe, getRecipeById } from "../controllers/recipe.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"
import { validateBody } from "../middleware/validateBody.js"
import { validateQuery } from "../middleware/validateQuery.js";
import {
  commentRecipeParamsSchema,
  createCommentSchema,
} from "../validations/commentValidation.js"
import { catalogRecipeQuerySchema, recipeIdParamsSchema } from "../validations/recipeValidation.js";
import { validateParams } from "../middleware/validateParams.js";

export const recipeRouter = Router();

recipeRouter.get("/", validateQuery(catalogRecipeQuerySchema), catalogRecipe);
recipeRouter.post(
  "/:recipeId/comments",
  protectRoute,
  validateParams(commentRecipeParamsSchema),
  validateBody(createCommentSchema),
  createComment
)
recipeRouter.get("/:id", validateParams(recipeIdParamsSchema), getRecipeById);

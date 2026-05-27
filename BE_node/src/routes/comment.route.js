import { Router } from "express"
import { createComment, deleteComment } from "../controler/comment.controler.js"
import { protectRoute } from "../middware/auth.middleware.js"
import {
  commentIdParamsSchema,
  commentRecipeParamsSchema,
  createCommentSchema,
} from "../middware/commentValidation.js"
import { validateBody } from "../middware/validateBody.js"
import { validateParams } from "../middware/validateParams.js"

export const commentRouter = Router()

commentRouter.use(protectRoute)

commentRouter.post(
  "/:recipeId",
  validateParams(commentRecipeParamsSchema),
  validateBody(createCommentSchema),
  createComment
)
commentRouter.delete(
  "/:id",
  validateParams(commentIdParamsSchema),
  deleteComment
)

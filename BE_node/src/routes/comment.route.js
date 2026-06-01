import { Router } from "express"
import { deleteComment } from "../controllers/comment.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import {
  commentIdParamsSchema,
} from "../validations/commentValidation.js"
import { validateParams } from "../middleware/validateParams.js"

export const commentRouter = Router()

commentRouter.use(protectRoute)

commentRouter.delete(
  "/:id",
  validateParams(commentIdParamsSchema),
  deleteComment
)

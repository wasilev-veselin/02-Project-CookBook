import { prisma } from "../config/prisma.js"
import { AppError } from "../errors/AppError.js"
import { sendSuccess } from "../utils/apiResponse.js"

const commentInclude = {
  author: {
    select: {
      id: true,
      username: true,
    },
  },
}

const createComment = async (req, res, next) => {
  const { recipeId } = req.validatedParams
  const { content, rating } = req.body

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { id: true },
  })

  if (!recipe) {
    throw new AppError(404, "RECIPE_NOT_FOUND", "Recipe not found")
  }

  const comment = await prisma.comment.create({
    data: {
      recipeId,
      authorId: req.user.id,
      content,
      rating,
    },
    include: commentInclude,
  })

  return sendSuccess(res, 201, {
    message: "Comment created",
    comment,
  })
}

const deleteComment = async (req, res, next) => {
  const { id } = req.validatedParams

  const comment = await prisma.comment.findUnique({
    where: { id },
    select: {
      id: true,
      authorId: true,
    },
  })

  if (!comment || comment.authorId !== req.user.id) {
    throw new AppError(404, "COMMENT_NOT_FOUND", "Comment not found")
  }

  await prisma.comment.delete({
    where: { id },
  })

  return sendSuccess(res, 200, { message: "Comment deleted" })
}

export { createComment, deleteComment }

import { prisma } from "../config/prisma.js"

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
    return res.status(404).json({ message: "Recipe not found" })
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

  return res.status(201).json({
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
    return res.status(404).json({ message: "Comment not found" })
  }

  await prisma.comment.delete({
    where: { id },
  })

  return res.status(200).json({ message: "Comment deleted" })
}

export { createComment, deleteComment }

import { prisma } from "../config/prisma.js"
import { AppError } from "../errors/AppError.js"
import { sendSuccess } from "../utils/apiResponse.js"

const favoriteRecipeInclude = {
  recipe: {
    include: {
      type: true,
      ingredients: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  },
}

const getFavoriteRecipes = async (req, res, next) => {
  const favorites = await prisma.favoriteRecipe.findMany({
    where: {
      userId: req.user.id,
    },
    include: favoriteRecipeInclude,
    orderBy: {
      createdAt: "desc",
    },
  })

  return sendSuccess(res, 200, { favorites })
}

const addFavoriteRecipe = async (req, res, next) => {
  const { recipeId } = req.validatedParams

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { id: true },
  })

  if (!recipe) {
    throw new AppError(404, "RECIPE_NOT_FOUND", "Recipe not found")
  }

  const favorite = await prisma.favoriteRecipe.upsert({
    where: {
      userId_recipeId: {
        userId: req.user.id,
        recipeId,
      },
    },
    update: {},
    create: {
      userId: req.user.id,
      recipeId,
    },
    include: favoriteRecipeInclude,
  })

  return sendSuccess(res, 201, {
    message: "Recipe added to favorites",
    favorite,
  })
}

const removeFavoriteRecipe = async (req, res, next) => {
  const { recipeId } = req.validatedParams

  const favorite = await prisma.favoriteRecipe.findUnique({
    where: {
      userId_recipeId: {
        userId: req.user.id,
        recipeId,
      },
    },
  })

  if (!favorite) {
    throw new AppError(404, "FAVORITE_NOT_FOUND", "Favorite recipe not found")
  }

  await prisma.favoriteRecipe.delete({
    where: {
      userId_recipeId: {
        userId: req.user.id,
        recipeId,
      },
    },
  })

  return sendSuccess(res, 200, { message: "Recipe removed from favorites" })
}

export { addFavoriteRecipe, getFavoriteRecipes, removeFavoriteRecipe }

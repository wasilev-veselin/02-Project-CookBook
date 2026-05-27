import { prisma } from "../config/prisma.js"

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

  return res.status(200).json({ favorites })
}

const addFavoriteRecipe = async (req, res, next) => {
  const { recipeId } = req.validatedParams

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { id: true },
  })

  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" })
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

  return res.status(201).json({
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
    return res.status(404).json({ message: "Favorite recipe not found" })
  }

  await prisma.favoriteRecipe.delete({
    where: {
      userId_recipeId: {
        userId: req.user.id,
        recipeId,
      },
    },
  })

  return res.status(200).json({ message: "Recipe removed from favorites" })
}

export { addFavoriteRecipe, getFavoriteRecipes, removeFavoriteRecipe }

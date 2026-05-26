import { prisma } from "../config/prisma.js";

const recipeInclude = {
    author: {
        select: {
            id: true,
            username: true,
            email: true,
        },
    },
    type: true,
    ingredients: true,
    comments: {
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
    },
};

const catalogRecipe = async (req, res, next) => {
    const recipes = await prisma.recipe.findMany({
        include: recipeInclude,
        orderBy: {
            createdAt: "desc",
        },
    });

    return res.status(200).json({ recipes });
};

const getRecipeById = async (req, res, next) => {
    const recipeId = Number(req.params.id);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
        return res.status(400).json({ message: "Invalid recipe id" });
    }

    const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        include: recipeInclude,
    });

    if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
    }

    return res.status(200).json({ recipe });
};

export { catalogRecipe, getRecipeById };

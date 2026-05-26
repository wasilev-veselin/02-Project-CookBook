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

const getIngredientFilters = (ingredients) => {
    if (!ingredients) {
        return [];
    }

    return ingredients
        .map((ingredient) => ({
            ingredients: {
                some: {
                    name: {
                        contains: ingredient,
                        mode: "insensitive",
                    },
                },
            },
        }));
};

const catalogRecipe = async (req, res, next) => {
    const { difficulty, cookingTime, ingredients, type, search } = req.validatedQuery;
    const where = {};
    const andFilters = getIngredientFilters(ingredients);

    if (difficulty) {
        where.difficulty = difficulty;
    }

    if (cookingTime) {
        where.cookingTime = {
            lte: cookingTime,
        };
    }

    if (type) {
        where.type = {
            name: {
                equals: type,
                mode: "insensitive",
            },
        };
    }

    if (search) {
        const searchValue = search.trim();

        if (searchValue) {
            where.OR = [
                {
                    title: {
                        contains: searchValue,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchValue,
                        mode: "insensitive",
                    },
                },
            ];
        }
    }

    if (andFilters.length > 0) {
        where.AND = andFilters;
    }

    const recipes = await prisma.recipe.findMany({
        where,
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

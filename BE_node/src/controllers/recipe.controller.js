import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";

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

    res.set("Cache-Control", "public, max-age=0, must-revalidate");

    return sendSuccess(res, 200, { recipes });
};

const getRecipeById = async (req, res, next) => {
    const { id } = req.validatedParams;

    const recipe = await prisma.recipe.findUnique({
        where: { id },
        include: recipeInclude,
    });

    if (!recipe) {
        throw new AppError(404, "RECIPE_NOT_FOUND", "Recipe not found");
    }

    res.set("Cache-Control", "public, max-age=0, must-revalidate");

    return sendSuccess(res, 200, { recipe });
};

export { catalogRecipe, getRecipeById };

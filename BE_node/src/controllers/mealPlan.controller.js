import { prisma } from "../config/prisma.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const getDayRange = (date) => {
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(startDate);

  endDate.setUTCDate(endDate.getUTCDate() + 1);

  return { startDate, endDate };
};

const getMealPlanByDate = async (req, res, next) => {
  const { date } = req.validatedQuery;
  const { startDate, endDate } = getDayRange(date);

  const mealPlans = await prisma.mealPlan.findMany({
    where: {
      userId: req.user.id,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      recipe: {
        include: {
          type: true,
          ingredients: true,
        },
      },
    },
    orderBy: {
      mealType: "asc",
    },
  });

  return sendSuccess(res, 200, {
    date,
    mealPlans,
  });
};

const updateMealPlan = async (req, res, next) => {
  const { id } = req.validatedParams;
  const { date, mealType, recipeId } = req.body;

  const mealPlan = await prisma.mealPlan.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!mealPlan || mealPlan.userId !== req.user.id) {
    return sendError(res, 404, { code: "MEAL_PLAN_NOT_FOUND", message: "Meal plan not found" });
  }

  if (recipeId) {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      select: { id: true },
    });

    if (!recipe) {
      return sendError(res, 404, { code: "RECIPE_NOT_FOUND", message: "Recipe not found" });
    }
  }

  const updatedMealPlan = await prisma.mealPlan.update({
    where: { id },
    data: {
      ...(date && { date: new Date(`${date}T00:00:00.000Z`) }),
      ...(mealType && { mealType }),
      ...(recipeId && { recipeId }),
    },
    include: {
      recipe: {
        include: {
          type: true,
          ingredients: true,
        },
      },
    },
  });

  return sendSuccess(res, 200, {
    message: "Meal plan updated",
    mealPlan: updatedMealPlan,
  });
};

const deleteMealPlan = async (req, res, next) => {
  const { id } = req.validatedParams;

  const mealPlan = await prisma.mealPlan.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!mealPlan || mealPlan.userId !== req.user.id) {
    return sendError(res, 404, { code: "MEAL_PLAN_NOT_FOUND", message: "Meal plan not found" });
  }

  await prisma.mealPlan.delete({
    where: { id },
  });

  return sendSuccess(res, 200, { message: "Meal plan deleted" });
};

export { deleteMealPlan, getMealPlanByDate, updateMealPlan };

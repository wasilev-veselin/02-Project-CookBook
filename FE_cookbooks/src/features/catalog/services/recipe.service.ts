import { z } from 'zod'
import { apiClient } from '../../../shared/api/apiClient'
import { requestApiData } from '../../../shared/api/parseApiData'
import { recipeSchema, type Recipe, type RecipeDifficulty } from '../../../shared/recipes/recipe.schema'

const AllRecipeResponseSchema = z.object({
  recipes: z.array(recipeSchema),
})

const recipeDetailsResponseSchema = z.object({
  recipe: recipeSchema,
})

export type CatalogRecipeFilters = {
  difficulty?: RecipeDifficulty
  cookingTime?: number
  type?: string
  search?: string
  ingredients?: string[]
}

type ApiRequestOptions = {
  signal?: AbortSignal
}

function buildCatalogRecipeParams(filters: CatalogRecipeFilters): Record<string, string | number> {
  const params: Record<string, string | number> = {}

  if (filters.difficulty) {
    params.difficulty = filters.difficulty
  }

  if (filters.cookingTime) {
    params.cookingTime = filters.cookingTime
  }

  if (filters.type) {
    params.type = filters.type
  }

  if (filters.search) {
    params.search = filters.search
  }

  if (filters.ingredients?.length) {
    params.ingredients = filters.ingredients.join(',')
  }

  return params
}

export async function getRecipesService(
  filters: CatalogRecipeFilters = {},
  options: ApiRequestOptions = {},
): Promise<Recipe[]> {
  const catalogRecipeResponse = await requestApiData('/recipes', AllRecipeResponseSchema, {
    params: buildCatalogRecipeParams(filters),
    signal: options.signal,
  })

  return catalogRecipeResponse.recipes
}

export async function getRecipeByIdService(
  recipeId: number,
  options: ApiRequestOptions = {},
): Promise<Recipe> {
  const recipeDetailsResponse = await requestApiData(`/recipes/${recipeId}`, recipeDetailsResponseSchema, {
    signal: options.signal,
  })

  return recipeDetailsResponse.recipe
}

export async function addFavoriteRecipeService(recipeId: number): Promise<void> {
  await apiClient.post(`/favorites/${recipeId}`)
}

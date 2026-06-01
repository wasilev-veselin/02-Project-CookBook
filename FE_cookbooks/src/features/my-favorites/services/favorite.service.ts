import { z } from 'zod'
import { apiClient } from '../../../shared/api/apiClient'
import { requestApiData } from '../../../shared/api/parseApiData'
import { recipeSchema, type Recipe } from '../../../shared/recipes/recipe.schema'

export type FavoriteRecipe = Recipe

const favoriteRecipeRecordSchema = z.object({
  userId: z.number(),
  recipeId: z.number(),
  createdAt: z.string(),
  recipe: recipeSchema,
})

const favoriteRecipesResponseSchema = z.object({
  favorites: z.array(favoriteRecipeRecordSchema),
})

type ApiRequestOptions = {
  signal?: AbortSignal
}

export async function getFavoriteRecipesService(
  options: ApiRequestOptions = {},
): Promise<FavoriteRecipe[]> {
  const favoriteRecipesResponse = await requestApiData('/favorites', favoriteRecipesResponseSchema, {
    signal: options.signal,
  })

  return favoriteRecipesResponse.favorites.map((favorite) => favorite.recipe)
}

export async function removeFavoriteRecipeService(recipeId: number): Promise<void> {
  await apiClient.delete(`/favorites/${recipeId}`)
}

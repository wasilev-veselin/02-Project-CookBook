import axios from 'axios'
import { API_BASE_URL } from '../../../config/env'

export type FavoriteRecipe = {
  id: number
  authorId: number
  typeId: number
  title: string
  description: string
  instructions: string
  cookingTime: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  servings: number
  imageUrl: string
  createdAt: string
  updatedAt: string
  author: {
    id: number
    username: string
  }
  type: {
    id: number
    name: string
  }
  ingredients: Array<{
    id: number
    recipeId: number
    name: string
    quantity: string
    unit: string
  }>
}

type FavoriteRecipeRecord = {
  userId: number
  recipeId: number
  createdAt: string
  recipe: FavoriteRecipe
}

type FavoriteRecipesResponse = {
  favorites: FavoriteRecipeRecord[]
}

const favoriteApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export async function getFavoriteRecipesService(): Promise<FavoriteRecipe[]> {
  const { data } = await favoriteApiClient.get<FavoriteRecipesResponse>('/favorite')

  return data.favorites.map((favorite) => favorite.recipe)
}

export async function removeFavoriteRecipeService(recipeId: number): Promise<void> {
  await favoriteApiClient.delete(`/favorite/${recipeId}`)
}

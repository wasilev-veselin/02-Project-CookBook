import axios from 'axios'

export type RecipeDifficulty = 'EASY' | 'MEDIUM' | 'HARD'

export type Recipe = {
  id: number
  authorId: number
  typeId: number
  title: string
  description: string
  instructions: string
  cookingTime: number
  difficulty: RecipeDifficulty
  servings: number
  imageUrl: string
  createdAt: string
  updatedAt: string
  author: {
    id: number
    username: string
    email?: string
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
  comments: Array<{
    id: number
    recipeId: number
    authorId: number
    content: string
    rating: number
    createdAt: string
    author: {
      id: number
      username: string
    }
  }>
}

type CatalogRecipeResponse = {
  recipes: Recipe[]
}

export type CatalogRecipeFilters = {
  difficulty?: RecipeDifficulty
  cookingTime?: number
  type?: string
  search?: string
  ingredients?: string[]
}

const API_BASE_URL = 'http://localhost:4000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

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

export async function getRecipesService(filters: CatalogRecipeFilters = {}): Promise<Recipe[]> {
  const { data } = await apiClient.get<CatalogRecipeResponse>('/allRecipe/catalogRecipe', {
    params: buildCatalogRecipeParams(filters),
  })

  return data.recipes
}

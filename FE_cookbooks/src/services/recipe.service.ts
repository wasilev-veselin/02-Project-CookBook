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

function buildCatalogRecipeUrl(filters: CatalogRecipeFilters): string {
  const url = new URL(`${API_BASE_URL}/allRecipe/catalogRecipe`)

  if (filters.difficulty) {
    url.searchParams.set('difficulty', filters.difficulty)
  }

  if (filters.cookingTime) {
    url.searchParams.set('cookingTime', String(filters.cookingTime))
  }

  if (filters.type) {
    url.searchParams.set('type', filters.type)
  }

  if (filters.search) {
    url.searchParams.set('search', filters.search)
  }

  if (filters.ingredients?.length) {
    url.searchParams.set('ingredients', filters.ingredients.join(','))
  }

  return url.toString()
}

export async function getCatalogRecipes(filters: CatalogRecipeFilters = {}): Promise<Recipe[]> {
  const response = await fetch(buildCatalogRecipeUrl(filters))

  if (!response.ok) {
    throw new Error('Could not load recipes.')
  }

  const data = (await response.json()) as CatalogRecipeResponse

  return data.recipes
}

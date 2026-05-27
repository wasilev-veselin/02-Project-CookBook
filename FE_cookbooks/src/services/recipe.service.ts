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

const API_BASE_URL = 'http://localhost:4000'

export async function getCatalogRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_BASE_URL}/allRecipe/catalogRecipe`)

  if (!response.ok) {
    throw new Error('Could not load recipes.')
  }

  const data = (await response.json()) as CatalogRecipeResponse

  return data.recipes
}

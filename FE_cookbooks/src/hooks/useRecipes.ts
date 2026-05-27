import { useEffect, useState } from 'react'
import {
  getCatalogRecipes,
  type CatalogRecipeFilters,
  type Recipe,
} from '../services/recipe.service'

type UseRecipesResult = {
  recipes: Recipe[]
  isLoading: boolean
  error: string | null
}

export function useRecipes(filters: CatalogRecipeFilters = {}): UseRecipesResult {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { cookingTime, difficulty, ingredients, search, type } = filters

  useEffect(() => {
    let isActive = true

    async function loadRecipes() {
      try {
        setIsLoading(true)
        setError(null)

        const catalogRecipes = await getCatalogRecipes({
          cookingTime,
          difficulty,
          ingredients,
          search,
          type,
        })

        if (isActive) {
          setRecipes(catalogRecipes)
        }
      } catch (caughtError) {
        if (isActive) {
          setError(caughtError instanceof Error ? caughtError.message : 'Could not load recipes.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadRecipes()

    return () => {
      isActive = false
    }
  }, [cookingTime, difficulty, ingredients, search, type])

  return { recipes, isLoading, error }
}

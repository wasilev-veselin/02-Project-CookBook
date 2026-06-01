import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../../shared/api/apiErrors'
import type { Recipe } from '../../../shared/recipes/recipe.schema'
import { getRecipesService, type CatalogRecipeFilters } from '../services/recipe.service'

type UseRecipesResult = {
  recipes: Recipe[]
  isLoading: boolean
  error: string | null
}

export function useRecipesHook(filters: CatalogRecipeFilters = {}): UseRecipesResult {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { cookingTime, difficulty, ingredients, search, type } = filters

  useEffect(() => {
    let isActive = true
    const abortController = new AbortController()

    async function loadRecipes() {
      try {
        setIsLoading(true)
        setError(null)

        const catalogRecipes = await getRecipesService({
          cookingTime,
          difficulty,
          ingredients,
          search,
          type,
        }, {
          signal: abortController.signal,
        })

        if (isActive) {
          setRecipes(catalogRecipes)
        }
      } catch (caughtError) {
        if (isActive) {
          setRecipes([])
          setError(getApiErrorMessage(caughtError, 'Could not load recipes.'))
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
      abortController.abort()
    }
  }, [cookingTime, difficulty, ingredients, search, type])

  return { recipes, isLoading, error }
}

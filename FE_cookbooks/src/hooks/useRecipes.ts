import { useEffect, useState } from 'react'
import { getCatalogRecipes, type Recipe } from '../services/recipe.service'

type UseRecipesResult = {
  recipes: Recipe[]
  isLoading: boolean
  error: string | null
}

export function useRecipes(): UseRecipesResult {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadRecipes() {
      try {
        setIsLoading(true)
        setError(null)

        const catalogRecipes = await getCatalogRecipes()

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
  }, [])

  return { recipes, isLoading, error }
}

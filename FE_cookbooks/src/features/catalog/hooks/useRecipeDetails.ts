import { useEffect, useState } from 'react'
import { getRecipeByIdService, type Recipe } from '../services/recipe.service'

type UseRecipeDetailsResult = {
  recipe: Recipe | null
  isLoading: boolean
  error: string | null
}

export function useRecipeDetails(recipeId: number | null): UseRecipeDetailsResult {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(recipeId))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadRecipe() {
      if (!recipeId) {
        setRecipe(null)
        setIsLoading(false)
        setError('Invalid recipe id.')
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const recipeDetails = await getRecipeByIdService(recipeId)

        if (isActive) {
          setRecipe(recipeDetails)
        }
      } catch (caughtError) {
        if (isActive) {
          setError(caughtError instanceof Error ? caughtError.message : 'Could not load recipe.')
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadRecipe()

    return () => {
      isActive = false
    }
  }, [recipeId])

  return { recipe, isLoading, error }
}

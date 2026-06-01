import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../../shared/api/apiErrors'
import type { Recipe } from '../../../shared/recipes/recipe.schema'
import { getRecipeByIdService } from '../services/recipe.service'

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
    const abortController = new AbortController()

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

        const recipeDetails = await getRecipeByIdService(recipeId, {
          signal: abortController.signal,
        })

        if (isActive) {
          setRecipe(recipeDetails)
        }
      } catch (caughtError) {
        if (isActive) {
          setError(getApiErrorMessage(caughtError, 'Could not load recipe.'))
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
      abortController.abort()
    }
  }, [recipeId])

  return { recipe, isLoading, error }
}

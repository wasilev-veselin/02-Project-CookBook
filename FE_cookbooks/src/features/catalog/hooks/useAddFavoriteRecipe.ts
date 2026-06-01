import { useState } from 'react'
import { getApiErrorMessage } from '../../../shared/api/apiErrors'
import { addFavoriteRecipeService } from '../services/recipe.service'

type UseAddFavoriteRecipeResult = {
  addFavoriteRecipe: (recipeId: number) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useAddFavoriteRecipe(): UseAddFavoriteRecipeResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addFavoriteRecipe(recipeId: number) {
    try {
      setIsLoading(true)
      setError(null)

      await addFavoriteRecipeService(recipeId)
    } catch (caughtError) {
      setError(getApiErrorMessage(caughtError, 'Неуспешно добавяне в любими.'))
    } finally {
      setIsLoading(false)
    }
  }

  return { addFavoriteRecipe, isLoading, error }
}

import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../../shared/api/apiErrors'
import {
  getFavoriteRecipesService,
  removeFavoriteRecipeService,
  type FavoriteRecipe,
} from '../services/favorite.service'

type UseFavoriteRecipesResult = {
  recipes: FavoriteRecipe[]
  isLoading: boolean
  error: string | null
  removeFavoriteRecipe: (recipeId: number) => Promise<void>
}

export function useFavoriteRecipes(shouldLoad: boolean): UseFavoriteRecipesResult {
  const [recipes, setRecipes] = useState<FavoriteRecipe[]>([])
  const [isLoading, setIsLoading] = useState(shouldLoad)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true
    const abortController = new AbortController()

    async function loadFavoriteRecipes() {
      if (!shouldLoad) {
        setRecipes([])
        setIsLoading(false)
        setError(null)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const favoriteRecipes = await getFavoriteRecipesService({
          signal: abortController.signal,
        })

        if (isActive) {
          setRecipes(favoriteRecipes)
        }
      } catch (caughtError) {
        if (isActive) {
          setError(getApiErrorMessage(caughtError, 'Неуспешно зареждане на любими рецепти.'))
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void loadFavoriteRecipes()

    return () => {
      isActive = false
      abortController.abort()
    }
  }, [shouldLoad])

  async function removeFavoriteRecipe(recipeId: number) {
    await removeFavoriteRecipeService(recipeId)
    setRecipes((currentRecipes) => currentRecipes.filter((recipe) => recipe.id !== recipeId))
  }

  return { recipes, isLoading, error, removeFavoriteRecipe }
}

import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { FavoriteRecipeCard } from '../components/FavoriteRecipeCard'
import { useFavoriteRecipes } from '../hooks/useFavoriteRecipes'

export function MyFavoritesPage() {
  const { user } = useAuth()
  const { recipes, isLoading, error, removeFavoriteRecipe } = useFavoriteRecipes(Boolean(user))

  if (!user) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-stone-950">Моите фаворити</h1>
          <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
            <p className="text-sm text-stone-600">
              Необходимо е да влезнеш за видиш любими рецепти.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Login
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-950">Моите фаворити</h1>
            <p className="mt-2 text-sm text-stone-600">Любими рецепти за {user.username}.</p>
          </div>
        </div>

        {isLoading && (
          <div className="mt-5 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600 shadow-sm">
            Зареждане на любими рецепти...
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && recipes.length === 0 && (
          <div className="mt-5 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600 shadow-sm">
            Няма добавени любими рецепти.
          </div>
        )}

        {!isLoading && !error && recipes.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
              <FavoriteRecipeCard
                key={recipe.id}
                recipe={recipe}
                onRemove={(recipeId) => {
                  void removeFavoriteRecipe(recipeId)
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

import { useOutletContext } from 'react-router-dom'
import { RecipeCard } from '../components/RecipeCard'
import { useRecipesHook } from '../hooks/useRecipes'
import type { CatalogOutletContext } from '../layouts/CatalogLayout'

export function CatalogPage() {
  const { selectedType } = useOutletContext<CatalogOutletContext>()
  const { recipes, isLoading, error } = useRecipesHook({ type: selectedType })

  return (
    <main className="min-w-0">
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-stone-950">
              {selectedType ? `Рецепти: ${selectedType}` : 'Всички рецепти'}
            </h1>
          </div>
        </div>

        {isLoading && (
          <div className="mt-5 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600 shadow-sm">
            Зареждане на рецепти...
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && recipes.length === 0 && (
          <div className="mt-5 rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600 shadow-sm">
            Няма намерени рецепти.
          </div>
        )}

        {!isLoading && !error && recipes.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

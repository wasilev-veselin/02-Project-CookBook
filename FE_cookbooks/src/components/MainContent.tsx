import { useRecipes } from '../hooks/useRecipes'
import type { RecipeCategoryType } from './CategorySidebar'

type MainContentProps = {
  selectedType?: RecipeCategoryType
}

export function MainContent({ selectedType }: MainContentProps) {
  const { recipes, isLoading, error } = useRecipes({ type: selectedType })

  return (
    <main className="min-w-0">
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-950">
              {selectedType ? `Рецепти: ${selectedType}` : 'Всички рецепти'}
            </h2>
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
              <article
                key={recipe.id}
                className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="h-40 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {recipe.type.name}
                    </span>
                    <span className="text-sm text-stone-500">{recipe.cookingTime} min</span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-stone-950">{recipe.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{recipe.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-wide text-stone-500">
                    <span>{recipe.difficulty}</span>
                    <span>{recipe.servings} порции</span>
                    <span>от {recipe.author.username}</span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
                      Детайли
                    </button>
                    <button className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800">
                      Favorite
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

import { Link, useParams } from 'react-router-dom'
import { useRecipeDetails } from '../hooks/useRecipeDetails'

function parseRecipeId(recipeId: string | undefined): number | null {
  if (!recipeId) {
    return null
  }

  const parsedRecipeId = Number(recipeId)

  return Number.isInteger(parsedRecipeId) ? parsedRecipeId : null
}

export function RecipeDetailsPage() {
  const { recipeId } = useParams()
  const { recipe, isLoading, error } = useRecipeDetails(parseRecipeId(recipeId))

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {isLoading && (
        <section className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
          Зареждане на рецепта...
        </section>
      )}

      {error && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error}
        </section>
      )}

      {!isLoading && !error && recipe && (
        <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          {recipe.imageUrl && (
            <img src={recipe.imageUrl} alt={recipe.title} className="h-80 w-full object-cover" />
          )}

          <div className="p-6">
            <Link to="/catalog" className="text-sm font-semibold text-emerald-700 hover:text-emerald-900">
              Назад към каталога
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {recipe.type.name}
              </span>
              <span className="text-sm text-stone-500">{recipe.cookingTime} min</span>
              <span className="text-sm text-stone-500">{recipe.difficulty}</span>
              <span className="text-sm text-stone-500">{recipe.servings} порции</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-stone-950">{recipe.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">{recipe.description}</p>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-stone-950">Съставки</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="rounded-md bg-stone-50 px-3 py-2 text-sm text-stone-700">
                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-stone-950">Инструкции</h2>
              <p className="mt-3 text-sm leading-6 text-stone-700">{recipe.instructions}</p>
            </section>
          </div>
        </article>
      )}
    </main>
  )
}

import { Link } from 'react-router-dom'
import type { FavoriteRecipe } from '../services/favorite.service'

type FavoriteRecipeCardProps = {
  recipe: FavoriteRecipe
  onRemove: (recipeId: number) => void
}

export function FavoriteRecipeCard({ recipe, onRemove }: FavoriteRecipeCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} className="h-40 w-full object-cover" />
      )}

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {recipe.type.name}
          </span>
          <span className="text-sm text-stone-500">{recipe.cookingTime} min</span>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-stone-950">{recipe.title}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">{recipe.description}</p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-wide text-stone-500">
          <span>{recipe.difficulty}</span>
          <span>{recipe.servings} порции</span>
          <span>от {recipe.author.username}</span>
        </div>

        <div className="mt-5 flex gap-2">
          <Link
            to={`/catalog/${recipe.id}`}
            className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            Детайли
          </Link>
          <button
            type="button"
            onClick={() => onRemove(recipe.id)}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}

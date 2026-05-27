const recipes = [
  {
    title: 'Паста с домати и босилек',
    category: 'Вечеря',
    time: '25 мин',
    description: 'Лека паста с пресен сос, пармезан и ароматен босилек.',
  },
  {
    title: 'Пилешка супа',
    category: 'Супи',
    time: '50 мин',
    description: 'Класическа домашна супа с много зеленчуци и фиде.',
  },
  {
    title: 'Овесени палачинки',
    category: 'Закуска',
    time: '15 мин',
    description: 'Бърза закуска с банан, овес и кисело мляко.',
  },
]

export function MainContent() {
  return (
    <main className="min-w-0">
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-stone-950">Всички рецепти</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <article
              key={recipe.title}
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {recipe.category}
                </span>
                <span className="text-sm text-stone-500">{recipe.time}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-stone-950">{recipe.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{recipe.description}</p>
              <div className="mt-5 flex gap-2">
                <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
                  Детайли
                </button>
                <button className="rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-800">
                  Favorite
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

const categories = [
  'Всички рецепти',
  'Закуска',
  'Обяд',
  'Вечеря',
  'Десерти',
  'Вегетариански',
  'Бързи рецепти',
  'Супи',
]

export function CategorySidebar() {
  return (
    <aside className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-28 lg:self-start">
      <h2 className="text-base font-semibold text-stone-950">Категории</h2>
      <nav aria-label="Категории рецепти" className="mt-4 space-y-1">
        {categories.map((category, index) => (
          <a
            key={category}
            href="#"
            className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
              index === 0
                ? 'bg-emerald-700 text-white'
                : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
            }`}
          >
            {category}
          </a>
        ))}
      </nav>
    </aside>
  )
}

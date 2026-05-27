const navigationItems = ['Каталог', 'Моите фаворити', 'Meal Plan']

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <a href="#" className="text-2xl font-bold tracking-tight text-emerald-800">
            CookBook
          </a>
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 lg:hidden">
            Login
          </button>
        </div>

        <nav aria-label="Основна навигация" className="flex flex-wrap gap-2">
          {navigationItems.map((item) => (
            <a
              key={item}
              href="#"
              className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="recipe-search">
            Търси рецепти
          </label>
          <input
            id="recipe-search"
            type="search"
            placeholder="Search recipes..."
            className="min-w-0 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:w-64"
          />
          <button className="hidden rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 lg:inline-flex">
            Login
          </button>
        </div>
      </div>
    </header>
  )
}

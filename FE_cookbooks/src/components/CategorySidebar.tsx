export type RecipeCategoryType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'DESSERT' | 'VEGETARIAN' | 'QUICK' | 'SOUP'

type Category = {
  label: string
  type?: RecipeCategoryType
}

const categories: Category[] = [
  { label: 'Всички рецепти' },
  { label: 'Закуска', type: 'BREAKFAST' },
  { label: 'Обяд', type: 'LUNCH' },
  { label: 'Вечеря', type: 'DINNER' },
  { label: 'Десерти', type: 'DESSERT' },
  { label: 'Вегетариански', type: 'VEGETARIAN' },
  { label: 'Бързи рецепти', type: 'QUICK' },
  { label: 'Супи', type: 'SOUP' },
]

type CategorySidebarProps = {
  selectedType?: RecipeCategoryType
  onCategorySelect: (type?: RecipeCategoryType) => void
}

export function CategorySidebar({ selectedType, onCategorySelect }: CategorySidebarProps) {
  return (
    <aside className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:sticky lg:top-28 lg:self-start">
      <h2 className="text-base font-semibold text-stone-950">Категории</h2>
      <nav aria-label="Категории рецепти" className="mt-4 space-y-1">
        {categories.map((category) => {
          const isSelected = category.type === selectedType || (!category.type && !selectedType)

          return (
            <button
              key={category.label}
              type="button"
              onClick={() => onCategorySelect(category.type)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                isSelected
                  ? 'bg-emerald-700 text-white'
                  : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
              }`}
            >
              {category.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

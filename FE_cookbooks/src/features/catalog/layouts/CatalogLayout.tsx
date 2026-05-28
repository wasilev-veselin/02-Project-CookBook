import { Outlet, useSearchParams } from 'react-router-dom'
import {
  CatalogLeftSidebar,
  type RecipeCategoryType,
} from '../components/CatalogLeftSidebar'

const recipeCategoryTypes: RecipeCategoryType[] = [
  'BREAKFAST',
  'LUNCH',
  'DINNER',
  'DESSERT',
  'VEGETARIAN',
  'QUICK',
  'SOUP',
]

export type CatalogOutletContext = {
  selectedType?: RecipeCategoryType
}

function getSelectedRecipeType(type: string | null): RecipeCategoryType | undefined {
  if (type && recipeCategoryTypes.includes(type as RecipeCategoryType)) {
    return type as RecipeCategoryType
  }

  return undefined
}

export function CatalogLayout() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedType = getSelectedRecipeType(searchParams.get('type'))

  function handleCategorySelect(type?: RecipeCategoryType) {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)

      if (type) {
        nextParams.set('type', type)
      } else {
        nextParams.delete('type')
      }

      return nextParams
    })
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <CatalogLeftSidebar selectedType={selectedType} onCategorySelect={handleCategorySelect} />
      <Outlet context={{ selectedType } satisfies CatalogOutletContext} />
    </div>
  )
}

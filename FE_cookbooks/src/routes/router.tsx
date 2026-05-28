import { createBrowserRouter, Navigate } from 'react-router-dom'
import { CatalogLayout } from '../features/catalog/layouts/CatalogLayout'
import { CatalogPage } from '../features/catalog/pages/CatalogPage'
import { RecipeDetailsPage } from '../features/catalog/pages/RecipeDetailsPage'
import { MealPlanPage } from '../features/meal-plan/pages/MealPlanPage'
import { MyFavoritesPage } from '../features/my-favorites/pages/MyFavoritesPage'
import { AppLayout } from '../layouts/AppLayout'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/catalog" replace />,
      },
      {
        path: 'catalog',
        element: <CatalogLayout />,
        children: [
          {
            index: true,
            element: <CatalogPage />,
          },
          {
            path: ':recipeId',
            element: <RecipeDetailsPage />,
          },
        ],
      },
      {
        path: 'my-favorites',
        element: <MyFavoritesPage />,
      },
      {
        path: 'meal-plan',
        element: <MealPlanPage />,
      },
      {
        path: '*',
        element: <Navigate to="/catalog" replace />,
      },
    ],
  },
])

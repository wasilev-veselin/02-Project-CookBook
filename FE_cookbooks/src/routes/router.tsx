import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { CatalogLayout } from '../features/catalog/layouts/CatalogLayout'
import { CatalogPage } from '../features/catalog/pages/CatalogPage'
import { RecipeDetailsPage } from '../features/catalog/pages/RecipeDetailsPage'
import { MealPlanPage } from '../features/meal-plan/pages/MealPlanPage'
import { MyFavoritesPage } from '../features/my-favorites/pages/MyFavoritesPage'
import { AppLayout } from '../layouts/AppLayout'
import { RouteErrorPage } from './RouteErrorPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
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
        ],
      },
      {
        path: 'catalog/:recipeId',
        element: <RecipeDetailsPage />,
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
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: '*',
        element: <Navigate to="/catalog" replace />,
      },
    ],
  },
])

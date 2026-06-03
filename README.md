# CookBook Project

CookBook is a recipe sharing and meal planning app with a React frontend and an Express/Prisma backend.

```txt
BE_node/      Express API
FE_cookbooks/ React frontend
postman/      API collections
```

## Run Locally

Backend:

```bash
cd BE_node
npm install
npm run dev
```

Frontend:

```bash
cd FE_cookbooks
npm install
npm run dev
```

Backend `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cookbook"
JWT_SECRET="replace-with-a-long-secret"
PORT=4000
CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"
SLOW_REQUEST_THRESHOLD_MS=1000
SLOW_QUERY_THRESHOLD_MS=200
```

Frontend `.env`:

```env
VITE_API_BASE_URL="http://localhost:4000"
```

## Shared API Contract

Frontend and backend are aligned on one response shape:

```js
{
  success: true,
  data: {},
  error: null,
}
```

or:

```js
{
  success: false,
  data: null,
  error: {
    code: "RECIPE_NOT_FOUND",
    message: "Recipe not found",
    requestId: "..."
  },
}
```

## Frontend Architecture

The frontend uses React, TypeScript, Vite, React Router, Axios, Zod, and Tailwind.

```txt
FE_cookbooks/src/
  components/     App-level shared UI, such as AppHeader
  config/         Runtime config, such as API base URL
  features/       Feature-owned pages, components, hooks, services
  layouts/        App-level route layouts
  routes/         React Router configuration and route error UI
  shared/         Cross-feature API and recipe schemas
  types/          Shared TypeScript API contract types
```

Feature folders own their own service and hook files:

```txt
features/
  auth/
    components/
    context/
    hooks/
    pages/
    services/
  catalog/
    components/
    hooks/
    layouts/
    pages/
    services/
  my-favorites/
    components/
    hooks/
    pages/
    services/
  meal-plan/
    pages/
```

### Routing and Layouts

Routes are configured with `createBrowserRouter` in `src/routes/router.tsx`.

There are two layout layers:

```txt
AppLayout
  Header
  Outlet

CatalogLayout
  CatalogLeftSidebar
  Outlet
```

`CatalogLayout` is used only for catalog list pages. Recipe details, favorites, meal plan, login, and register pages should not render the catalog sidebar.

### Frontend Data Access

The shared axios client lives in `src/shared/api/apiClient.ts`.

Feature services call backend endpoints and keep endpoint ownership inside the feature:

```txt
catalog/services/recipe.service.ts
my-favorites/services/favorite.service.ts
auth/services/auth.service.ts
```

Services should parse API response data with Zod schemas where the response shape matters. Shared recipe schemas live in `src/shared/recipes`.

### Frontend Auth


Auth state is held in `AuthContext` and persisted in `localStorage`.

Use:

```txt
AuthenticatedOnly
UnauthenticatedOnly
useAuth
```

for conditional UI such as Login/Logout buttons and Favorite actions.

## Backend Architecture

The backend uses Express 5, Prisma, PostgreSQL, JWT cookie auth, Zod validation, centralized error handling, structured API responses, request logging, and slow query logging.

```txt
BE_node/src/
  config/        Prisma client and database connection
  controllers/   HTTP request handlers
  errors/        Application error classes
  middleware/    Auth, validation, request logging, error handling
  routes/        REST route definitions
  utils/         Shared helpers: API responses, logger, JWT token
  validations/   Zod schemas for request boundaries
```

Controllers should stay focused on request flow and success responses. Business errors should be thrown as `AppError` and handled by the global error handler.

Because the backend uses Express 5, thrown async errors and rejected promises from controllers are automatically forwarded to the error middleware. Do not add repetitive `try/catch` blocks only to call `next(error)`.

### Backend Error Handling

Expected business errors use `AppError`:

```js
throw new AppError(404, "RECIPE_NOT_FOUND", "Recipe not found")
```

`errorHandler` maps these errors into the API response contract and logs them with request context.

Prisma errors are mapped centrally:

```txt
P2002   -> UNIQUE_CONSTRAINT_FAILED
P2003   -> INVALID_RELATION
P2025   -> RECORD_NOT_FOUND
unknown -> DATABASE_ERROR
```

For unknown database errors, the client receives a safe message like `Database error`. The original Prisma message remains in backend logs and can be found by `requestId`.

### Backend Logging

Use the central logger from `src/utils/logger.js`:

```js
logger.info("Message", { requestId, path })
logger.warn("Message", { durationMs })
logger.error("Message", { error })
```

Do not use `console.log` directly outside the logger helper.

Request lifecycle logs:

```txt
START
FINISH
CLOSE_BEFORE_FINISH
SLOW_REQUEST
REQUEST_TIMEOUT
```

`SLOW_REQUEST` is emitted when request duration is greater than or equal to `SLOW_REQUEST_THRESHOLD_MS`. Default: `1000`.

`SLOW_DATABASE_QUERY` is emitted when Prisma query duration is greater than or equal to `SLOW_QUERY_THRESHOLD_MS`. Default: `200`.

In development, slow query logs include query params. In production, params are hidden.

## REST Routes

Current route format:

```txt
GET    /recipes
GET    /recipes/:id
POST   /recipes/:recipeId/comments
DELETE /comments/:id

GET    /favorites
POST   /favorites/:recipeId
DELETE /favorites/:recipeId

GET    /meal-plans
PATCH  /meal-plans/:id
DELETE /meal-plans/:id

POST   /auth/register
POST   /auth/login
POST   /auth/logout
```

Protected routes use `protectRoute` and expect JWT auth from the `jwt` cookie or a `Bearer` token.

## Validation

Backend request validation is done before controllers using Zod middleware:

```txt
validateBody
validateParams
validateQuery
```

Shared backend schemas live in `BE_node/src/validations/commonSchemas.js`. Put repeated validation logic there instead of duplicating schemas across feature validation files.

## Development Decisions

- Keep frontend and backend aligned on `{ success, data, error }`.
- Keep frontend organized by feature ownership, not by file type only.
- Keep app-level shared UI in `src/components`; feature UI stays in feature folders.
- Keep route layout concerns in `layouts` and `features/*/layouts`.
- Keep business errors as `AppError`, not direct controller `sendError`.
- Rely on Express 5 automatic async error forwarding instead of repetitive controller `try/catch`.
- Keep Prisma/system error mapping centralized in `errorHandler`.
- Keep validation failures at the middleware boundary.
- Keep request and database bottleneck logging lightweight before adding OpenTelemetry.
- Keep public error messages safe; use `requestId` and backend logs for internal diagnosis.

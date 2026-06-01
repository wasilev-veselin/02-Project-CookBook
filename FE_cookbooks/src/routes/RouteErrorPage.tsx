import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

function getRouteErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return error.statusText || 'The page could not be loaded.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong.'
}

export function RouteErrorPage() {
  const error = useRouteError()

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full max-w-lg rounded-lg border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6">{getRouteErrorMessage(error)}</p>
        <Link
          to="/catalog"
          className="mt-5 inline-flex rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Back to catalog
        </Link>
      </section>
    </main>
  )
}

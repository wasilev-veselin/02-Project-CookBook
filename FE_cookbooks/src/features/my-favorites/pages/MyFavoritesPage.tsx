export function MyFavoritesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-950">Моите фаворити</h1>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
          <p className="mt-2 text-sm text-stone-600">
            Необходимо е да  влезнеш за видиш любими рецепти.
          </p>
        </div>
      </section>
    </main>
  )
}

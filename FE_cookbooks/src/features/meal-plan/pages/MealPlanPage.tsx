const weekDays = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя']

export function MealPlanPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-950">Meal Plan</h1>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Седмичен план за рецепти по дни и хранения.
            </p>
          </div>
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Добави рецепта
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {weekDays.map((day) => (
            <article key={day} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-stone-950">{day}</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-md bg-stone-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Закуска</p>
                  <p className="mt-1 text-sm text-stone-600">Няма избрана рецепта</p>
                </div>
                <div className="rounded-md bg-stone-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Обяд</p>
                  <p className="mt-1 text-sm text-stone-600">Няма избрана рецепта</p>
                </div>
                <div className="rounded-md bg-stone-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Вечеря</p>
                  <p className="mt-1 text-sm text-stone-600">Няма избрана рецепта</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

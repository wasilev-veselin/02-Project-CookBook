import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { registerService } from '../services/auth.service'

export function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setError(null)
      setSuccessMessage(null)

      const response = await registerService({ username, email, password })

      setSuccessMessage(response.status ?? 'Registration successful.')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Registration failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex max-w-7xl justify-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-stone-950">Register</h1>
        <p className="mt-2 text-sm text-stone-600">Създай профил за любими рецепти и meal plans.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="register-username" className="text-sm font-medium text-stone-700">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              minLength={3}
              className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="mt-2 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          Вече имаш профил?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-900">
            Login
          </Link>
        </p>
      </section>
    </main>
  )
}

import { type ReactNode, useState } from 'react'
import { AuthContext } from './auth-context'
import {
  loginService,
  logoutService,
  registerService,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from '../services/auth.service'

type AuthProviderProps = {
  children: ReactNode
}

const AUTH_USER_STORAGE_KEY = 'cookbook.auth.user'

function getStoredUser(): AuthUser | null {
  const storedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as AuthUser
  } catch {
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
  const isAuthenticated = Boolean(user)

  async function login(payload: LoginPayload): Promise<string> {
    const response = await loginService(payload)

    setUser(response.user)
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(response.user))

    return response.message
  }

  async function register(payload: RegisterPayload): Promise<string> {
    const response = await registerService(payload)

    setUser(response.user)
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(response.user))

    return response.status
  }

  async function logout() {
    await logoutService()
    setUser(null)
    window.localStorage.removeItem(AUTH_USER_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

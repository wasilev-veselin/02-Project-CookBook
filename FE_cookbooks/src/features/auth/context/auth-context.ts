import { createContext } from 'react'
import type { AuthUser, LoginPayload, RegisterPayload } from '../services/auth.service'

export type AuthContextValue = {
  user: AuthUser | null
  login: (payload: LoginPayload) => Promise<string>
  register: (payload: RegisterPayload) => Promise<string>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

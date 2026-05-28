import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

type AuthenticatedOnlyProps = {
  children: ReactNode
}

export function AuthenticatedOnly({ children }: AuthenticatedOnlyProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  return children
}

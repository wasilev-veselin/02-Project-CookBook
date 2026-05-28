import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

type UnauthenticatedOnlyProps = {
  children: ReactNode
}

export function UnauthenticatedOnly({ children }: UnauthenticatedOnlyProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return null
  }

  return children
}

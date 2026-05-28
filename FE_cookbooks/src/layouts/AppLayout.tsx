import { Outlet } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader />
      <Outlet />
    </div>
  )
}

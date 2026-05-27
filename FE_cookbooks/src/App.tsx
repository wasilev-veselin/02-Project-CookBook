import { AppHeader } from './components/AppHeader'
import { CategorySidebar } from './components/CategorySidebar'
import { MainContent } from './components/MainContent'

function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <AppHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <CategorySidebar />
        <MainContent />
      </div>
    </div>
  )
}

export default App

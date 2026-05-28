import { useOutletContext } from 'react-router-dom'
import { MainContent } from '../../../components/MainContent'
import type { CatalogOutletContext } from '../layouts/CatalogLayout'

export function CatalogPage() {
  const { selectedType } = useOutletContext<CatalogOutletContext>()

  return <MainContent selectedType={selectedType} />
}

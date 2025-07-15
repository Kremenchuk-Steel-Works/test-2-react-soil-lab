import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { findRouteObjectByPath } from '@/app/routes/utils'
import { useCanAccessPath } from '@/shared/hooks/usePermissions'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs'
import Button from '@/shared/ui/button/Button'

export function PageHeader() {
  const navigate = useNavigate()
  const location = useLocation()

  const canAdd = useCanAccessPath(`${location.pathname}/add`)

  // Проверяем метаданные текущего роута
  const shouldShowAddButton = useMemo(() => {
    const currentRoute = findRouteObjectByPath(location.pathname)
    return currentRoute?.meta?.showAddButton === true
  }, [location.pathname])

  const handleAddClick = () => {
    navigate(`${location.pathname}/add`)
  }

  return (
    <div className="flex justify-between">
      <Breadcrumbs />
      {shouldShowAddButton && canAdd && (
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={handleAddClick}
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Додати</span>
        </Button>
      )}
    </div>
  )
}

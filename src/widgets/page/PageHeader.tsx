import { useMemo } from 'react'
import { Pen, Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { findRouteObjectByPath } from '@/app/routes/utils'
import { useCanAccessPath } from '@/shared/hooks/usePermissions'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs'
import Button from '@/shared/ui/button/Button'

export function PageHeader() {
  const navigate = useNavigate()
  const location = useLocation()

  const addPath = `${location.pathname}/add`
  const canAdd = useCanAccessPath(addPath)

  const editPath = `${location.pathname}/update`
  const canEdit = useCanAccessPath(editPath)

  // Проверяем метаданные текущего роута
  const canShowAddButton = useMemo(() => {
    const currentRoute = findRouteObjectByPath(location.pathname)
    return currentRoute?.meta?.showAddButton === true
  }, [location.pathname])

  const canShowEditButton = useMemo(() => {
    const currentRoute = findRouteObjectByPath(location.pathname)
    return currentRoute?.meta?.showEditButton === true
  }, [location.pathname])

  const handleAddClick = () => {
    navigate(addPath)
  }

  const handleEditClick = () => {
    navigate(editPath)
  }

  console.log(
    addPath,
    'canAdd',
    canAdd,
    'shouldShowAddButton',
    canShowAddButton,
    'editPath',
    editPath,
    'canEdit',
    canEdit,
    'shouldShowEditButton',
    canShowEditButton,
  )

  return (
    <div className="flex justify-between">
      <Breadcrumbs />
      <div className="flex items-center gap-x-2">
        {canShowAddButton && canAdd && (
          <Button
            className="flex items-center justify-center gap-1 whitespace-nowrap"
            onClick={handleAddClick}
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Додати</span>
          </Button>
        )}

        {canShowEditButton && canEdit && (
          <Button
            className="flex items-center justify-center gap-1 bg-orange-500 whitespace-nowrap hover:bg-orange-600"
            onClick={handleEditClick}
          >
            <Pen className="h-5 w-5" /> <span>Редагувати</span>
          </Button>
        )}
      </div>
    </div>
  )
}

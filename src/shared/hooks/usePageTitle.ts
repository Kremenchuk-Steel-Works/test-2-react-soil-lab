import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes/routes'
import { findRouteObjectByPath, isNonIndexRoute } from '@/app/routes/utils/utils'

const BASE_TITLE = 'KSZ'

export function usePageTitle(): void {
  const location = useLocation()
  const { pathname } = location

  useEffect(() => {
    const currentRoute = findRouteObjectByPath(pathname, APP_ROUTES)

    if (currentRoute && isNonIndexRoute(currentRoute) && currentRoute.label) {
      document.title = `${BASE_TITLE} | ${currentRoute.label}`
    } else {
      // Если для роута не найден label, устанавливаем заголовок по умолчанию
      document.title = BASE_TITLE
    }

    // Возвращаем функцию очистки, чтобы при размонтировании компонента заголовок сбрасывался
    return () => {
      document.title = BASE_TITLE
    }
  }, [pathname])
}

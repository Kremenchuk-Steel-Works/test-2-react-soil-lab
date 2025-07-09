import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { findRouteObjectByPath } from '@/app/routes/utils'

const BASE_TITLE = 'KSZ'

export function usePageTitle(): void {
  const location = useLocation()
  const { pathname } = location

  useEffect(() => {
    const currentRoute = findRouteObjectByPath(pathname)

    if (currentRoute && currentRoute.label) {
      document.title = `${BASE_TITLE} | ${currentRoute.label}`
    } else {
      // Если для роута не найден label, устанавливаем заголовок по умолчанию
      document.title = BASE_TITLE
    }

    // Возвращаем функцию очистки, чтобы при размонтировании компонента
    // (хотя в нашем случае это маловероятно) заголовок сбрасывался.
    return () => {
      document.title = BASE_TITLE
    }
  }, [pathname]) // Зависимость от pathname, чтобы хук срабатывал при смене URL
}

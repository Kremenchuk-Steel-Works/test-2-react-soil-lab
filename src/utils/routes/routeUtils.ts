import type { AppRoute } from '@/app/routes/types'

export function findRouteByKey(routes: AppRoute[], key: string): AppRoute | null {
  for (const route of routes) {
    //  Перевіряємо ключ на поточному рівні
    if (route.key === key) {
      return route
    }
    // Якщо є дочірні елементи, шукаємо рекурсивно в них
    if (route.children) {
      const found = findRouteByKey(route.children, key)
      if (found) {
        return found
      }
    }
  }
  // Якщо нічого не знайдено
  return null
}

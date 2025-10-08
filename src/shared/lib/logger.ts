import log, { type Logger } from 'loglevel'

const LOG_LEVEL_KEY = 'debug_levels'

const getActiveNamespaces = (): string[] => {
  if (typeof window === 'undefined') {
    return []
  }
  const storedValue = window.localStorage.getItem(LOG_LEVEL_KEY)
  return storedValue ? storedValue.split(',') : []
}

// Глобальное расширение для window, чтобы избежать any
declare global {
  interface Window {
    setDebug: (namespaces: string) => void
  }
}

/**
 * Создает и настраивает экземпляр логгера для конкретного модуля.
 * @param {string} namespace - Имя модуля или компонента для логирования.
 * @returns {Logger} Настроенный экземпляр логгера.
 */
export const createLogger = (namespace: string): Logger => {
  const logger = log.getLogger(namespace)

  if (import.meta.env.PROD) {
    // В продакшене всегда показываем только ошибки.
    logger.setLevel('error')
  } else {
    // В разработке управляем через localStorage.
    const activeNamespaces = getActiveNamespaces()
    if (activeNamespaces.includes('*') || activeNamespaces.includes(namespace)) {
      logger.setLevel('debug')
    } else {
      logger.setLevel('warn')
    }
  }

  return logger
}

// Глобальный логгер для общего использования
// Создаем экземпляр по умолчанию для тех случаев, где не нужен отдельный неймспейс.
export const logger = createLogger('global')

// Утилита для удобства разработки
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.setDebug = (namespaces: string) => {
    console.log(`[Logger] Debugging levels are set for: ${namespaces}. Reload page.`)
    window.localStorage.setItem(LOG_LEVEL_KEY, namespaces)
    window.location.reload()
  }

  console.log(
    `[Logger] Use window.setDebug('namespace1,global') or window.setDebug('*') in console.`,
  )
}

import type { RequestHandler } from 'msw'
import { createLogger } from '@/shared/lib/logger'

const logger = createLogger('Mock')

const modules = import.meta.glob<Record<string, () => RequestHandler[] | unknown>>(
  '/src/shared/api/soil-lab/endpoints/**/*.msw.ts',
  { eager: true },
)

export const handlers = Object.values(modules).flatMap((module) => {
  const mockFactoryKey = Object.keys(module).find(
    (key) => key.endsWith('Mock') && !key.endsWith('Handler') && !key.endsWith('ResponseMock'),
  )

  if (mockFactoryKey) {
    const mockFactory = module[mockFactoryKey] as () => RequestHandler[]
    return mockFactory()
  }

  logger.warn(`[MSW] No valid mock aggregator found in module:`, module)
  return []
})

logger.log('[MSW] Loaded handlers:', handlers)

// export const handlers = [...getMoldPassportsMock(), ,]

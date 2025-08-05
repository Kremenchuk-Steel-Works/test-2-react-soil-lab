import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Эта функция настраивает сервис-воркер с нашими хендлерами
export const worker = setupWorker(...handlers)

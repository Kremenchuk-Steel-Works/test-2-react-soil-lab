import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/app/providers/auth/provider'
import { router } from '@/app/routes/AppRoutes.tsx'
import { initApp } from '@/init.ts'
import { logger } from '@/shared/lib/logger'
import { ModalProvider } from '@/shared/ui/modal/ModalProvider'
import { SidebarProvider } from '@/widgets/sidebar/SidebarProvider.tsx'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

// Создаем асинхронную функцию для условного запуска моков
async function enableMocking() {
  if (import.meta.env.VITE_APP_MOCKING !== 'true') {
    return
  }

  // Динамически импортируем наш воркер, чтобы он не попадал в продакшен-сборку
  const { worker } = await import('./mocks/browser') // Убедись, что путь к твоему `browser.ts` верный

  // 'bypass' означает, что если запрос не найден в моках, он пойдет дальше в сеть.
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

function renderApp() {
  const rootEl = document.getElementById('root')
  if (!rootEl) {
    throw new Error('#root not found')
  }

  createRoot(rootEl).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SidebarProvider>
            <ModalProvider>
              <RouterProvider router={router} />
              <ReactQueryDevtools
                initialIsOpen={false}
                buttonPosition="bottom-right"
                position="bottom"
              />
            </ModalProvider>
          </SidebarProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}

async function bootstrap() {
  try {
    await enableMocking()
  } catch (e) {
    logger.warn('[msw] failed to start', e)
  }

  try {
    initApp()
  } catch (e) {
    logger.error('[initApp] failed', e)
  }

  renderApp()
}

void bootstrap()

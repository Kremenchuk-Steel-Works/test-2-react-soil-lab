import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/app/providers/auth/provider'
import { router } from '@/app/routes/AppRoutes.tsx'
import { initApp } from '@/init.ts'
import { ModalProvider } from '@/shared/ui/modal/ModalContext.tsx'
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

// Вызываем функцию и рендерим приложение ТОЛЬКО ПОСЛЕ того, как она отработает.
enableMocking().then(() => {
  initApp()

  createRoot(document.getElementById('root')!).render(
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
})

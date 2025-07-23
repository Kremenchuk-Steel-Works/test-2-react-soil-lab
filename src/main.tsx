import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/app/providers/auth/ui.tsx'
import { router } from '@/app/routes/AppRoutes.tsx'
import { initApp } from '@/init.ts'
import { ModalProvider } from '@/shared/ui/modal/ModalContext.tsx'
import { SidebarProvider } from '@/widgets/sidebar/SidebarProvider.tsx'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Время, в течение которого данные считаются свежими.
      staleTime: 1000 * 60 * 5,
      // Количество повторных попыток запросов
      retry: 1,
    },
  },
})
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

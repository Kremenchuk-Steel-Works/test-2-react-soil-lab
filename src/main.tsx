import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import { initApp } from "./init.ts"
import { AuthProvider } from "./app/providers/auth/ui.tsx"
import { router } from "./app/routes/AppRoutes.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ModalProvider } from "./shared/ui/modal/ModalContext.tsx"
import { SidebarProvider } from "./widgets/sidebar/SidebarProvider.tsx"

const queryClient = new QueryClient()
initApp()

createRoot(document.getElementById("root")!).render(
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
  </StrictMode>
)

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import { initApp } from "./init.ts"
import { AuthProvider } from "./components/AuthProvider/AuthProvider.tsx"
import { router } from "./routes/AppRoutes.tsx"
import { SidebarProvider } from "./components/Sidebar/SidebarProvider.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient()
initApp()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-right"
            position="bottom"
          />
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)

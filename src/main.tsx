import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import { initApp } from "./init.ts"
import { AuthProvider } from "./components/AuthProvider/AuthProvider.tsx"
import { router } from "./routes/AppRoutes.tsx"
import { SidebarProvider } from "./components/Sidebar/SidebarProvider.tsx"

initApp()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </AuthProvider>
  </StrictMode>
)

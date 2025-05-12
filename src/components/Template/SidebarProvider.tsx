import React, { createContext, useContext, useState } from "react"

export type SidebarContextType = {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = (): SidebarContextType => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}

// Компонент-провайдер
export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [collapsed, setCollapsed] = useState(false)

  // Возвращаем провайдер с нужным значением
  const value: SidebarContextType = { collapsed, setCollapsed }
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

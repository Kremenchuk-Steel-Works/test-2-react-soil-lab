import { createContext, useContext } from 'react'

export type SidebarContextType = {
  collapsed: boolean
  broken: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  expandedSubMenus: Set<string>
  collapsedSubMenu: string | null
  toggleSubMenu: (id: string, forceCollapsed?: boolean) => void
  closeSubMenu: () => void
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = (): SidebarContextType => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}

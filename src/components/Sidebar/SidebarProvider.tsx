import React, { createContext, useContext, useEffect, useState } from "react"

type SidebarContextType = {
  collapsed: boolean
  broken: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  expandedSubMenus: Set<string>
  collapsedSubMenu: string | null
  toggleSubMenu: (id: string, forceCollapsed?: boolean) => void
  closeSubMenu: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider")
  return ctx
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(
    () =>
      window.matchMedia("(max-width: 768px)").matches ||
      localStorage.getItem("sidebar-collapsed") === "true"
  )
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 768px)").matches
  )

  // **Multiple** expanded sub-menus when expanded
  const [expandedSubMenus, setExpandedSubMenus] = useState<Set<string>>(
    new Set()
  )
  // **Single** open sub-menu when collapsed (popup)
  const [collapsedSubMenu, setCollapsedSubMenu] = useState<string | null>(null)

  // sync media query
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const listener = () => {
      const mobile = mql.matches
      setIsMobile(mobile)
      // Если зашли в мобильный — сворачиваем sidebar и закрываем сабменю-портал
      if (mobile) {
        setCollapsed(true)
        setCollapsedSubMenu(null)
      }
    }

    mql.addEventListener("change", listener)
    return () => mql.removeEventListener("change", listener)
  }, [])

  // when the sidebar **toggles** collapsed state, only reset collapsedSubMenu
  useEffect(() => {
    setCollapsedSubMenu(null)
    localStorage.setItem("sidebar-collapsed", String(collapsed))
  }, [collapsed])

  const toggleSidebar = () => setCollapsed((c) => !c)
  const closeSidebar = () => setCollapsed(true)

  // unified toggler: branch on collapsed
  const toggleSubMenu = (id: string, forceCollapsed = false) => {
    if (collapsed && forceCollapsed) {
      // collapsed: single popup
      setCollapsedSubMenu((prev) => (prev === id ? null : id))
    } else {
      // expanded: multiple independent
      setExpandedSubMenus((prev) => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
      })
    }
  }

  const closeSubMenu = () => {
    if (collapsed) setCollapsedSubMenu(null)
    else setExpandedSubMenus(new Set())
  }

  const value: SidebarContextType = {
    collapsed,
    broken: isMobile,
    toggleSidebar,
    closeSidebar,
    expandedSubMenus,
    collapsedSubMenu,
    toggleSubMenu,
    closeSubMenu,
  }

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

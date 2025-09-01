import { useEffect, useState, type ReactNode } from 'react'
import { SidebarContext, type SidebarContextType } from './sidebar-context'

type Props = { children: ReactNode }

export function SidebarProvider({ children }: Props) {
  // Инициализация: читаем из media query и localStorage (с SSR-проверкой)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(max-width: 768px)').matches ||
      localStorage.getItem('sidebar-collapsed') === 'true'
    )
  })

  // Признак мобильной ширины экрана
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 768px)').matches
  })

  // В развернутом режиме можно открыть несколько подпунктов
  const [expandedSubMenus, setExpandedSubMenus] = useState<Set<string>>(new Set())
  // В свернутом режиме открыт только один подпункт (показывается как попап)
  const [collapsedSubMenu, setCollapsedSubMenu] = useState<string | null>(null)

  // Синхронизируемся с media query (при изменении ширины экрана)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(max-width: 768px)')

    const listener = () => {
      const mobile = mql.matches
      setIsMobile(mobile)
      // При входе в мобильный режим — сворачиваем сайдбар и закрываем попап подпункта
      if (mobile) {
        setCollapsed(true)
        setCollapsedSubMenu(null)
      }
    }

    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])

  // При смене состояния сайдбара сбрасываем открытый подпункт и сохраняем флаг в localStorage
  useEffect(() => {
    setCollapsedSubMenu(null)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(collapsed))
    }
  }, [collapsed])

  const toggleSidebar = () => setCollapsed((c) => !c)
  const closeSidebar = () => setCollapsed(true)

  // Универсальный тогглер подпунктов: ветвимся по режиму (свернут/развернут)
  const toggleSubMenu: SidebarContextType['toggleSubMenu'] = (id, forceCollapsed = false) => {
    if (collapsed && forceCollapsed) {
      // Свернутый режим: управляем одиночным попапом
      setCollapsedSubMenu((prev) => (prev === id ? null : id))
    } else {
      // Развернутый режим: можно независимо открывать/закрывать несколько подпунктов
      setExpandedSubMenus((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    }
  }

  // Закрыть подпункты в зависимости от режима
  const closeSubMenu = () => {
    if (collapsed) setCollapsedSubMenu(null)
    else setExpandedSubMenus(new Set())
  }

  // Объект контекста, мемоизация здесь не критична: все функции стабильны,
  // а перерендеры завязаны на локальные стейты
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

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export default SidebarProvider

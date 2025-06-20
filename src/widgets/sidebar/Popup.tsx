import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSidebar } from '@/widgets/sidebar/SidebarProvider'

const Popup = ({
  btnRef,
  children,
  isCollapsedOpen,
  isMainMenu,
}: {
  btnRef: React.RefObject<HTMLButtonElement | null>
  children: React.ReactNode
  isCollapsedOpen: boolean
  isMainMenu: boolean
}) => {
  const { collapsed, closeSubMenu } = useSidebar()
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const [popupPos, setPopupPos] = useState<{
    top: number
    bottom: number
    left: number
  }>({
    top: 0,
    bottom: 0,
    left: 0,
  })

  // Пересчитываем позицию ТОЛЬКО при открытии вкладки в collapsed-режиме
  useLayoutEffect(() => {
    if (collapsed && isCollapsedOpen && btnRef.current && isMainMenu) {
      const rect = btnRef.current.getBoundingClientRect()
      setPopupPos({ top: rect.top, bottom: rect.bottom, left: rect.right })
    }
  }, [collapsed, isCollapsedOpen, isMainMenu, btnRef.current])

  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [children])

  const style: React.CSSProperties = {
    left: popupPos.left,
  }
  if (popupPos.top <= window.innerHeight / 2) {
    style.top = popupPos.top
  } else {
    style.top = popupPos.bottom - height
  }

  // Блокируем рендер до вычисления
  const positioned = popupPos.left > 0 || popupPos.top > 0
  if (!positioned) return null

  return createPortal(
    <>
      {/* Клик вне элементов popup */}
      <div className="fixed inset-0" onClick={closeSubMenu} />
      <div
        ref={containerRef}
        className="fixed z-50 max-h-[50vh] w-70 overflow-y-auto bg-gray-50 shadow-lg dark:bg-[#0e1523]"
        style={style}
      >
        {children}
      </div>
    </>,
    document.body,
  )
}

export default Popup

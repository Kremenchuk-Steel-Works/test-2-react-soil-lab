import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSidebar } from '@/widgets/sidebar/SidebarProvider'

interface PopupProps {
  btnRef: React.RefObject<HTMLButtonElement | null>
  children: React.ReactNode
  isCollapsedOpen: boolean
  isMainMenu: boolean
}

const Popup = ({ btnRef, children, isCollapsedOpen }: PopupProps) => {
  const { closeSubMenu } = useSidebar()
  const containerRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties | null>(null)

  useLayoutEffect(() => {
    // Выполняем расчеты только когда попап должен быть открыт
    if (isCollapsedOpen && btnRef.current && containerRef.current) {
      const btnRect = btnRef.current.getBoundingClientRect()
      const popupRect = containerRef.current.getBoundingClientRect()
      const popupHeight = popupRect.height
      const viewportHeight = window.innerHeight

      let topPosition: number

      // Основная логика: открываем вниз или вверх
      if (btnRect.top + popupHeight <= viewportHeight) {
        // Если попап помещается вниз от кнопки
        topPosition = btnRect.top
      } else {
        // Иначе, выравниваем по нижнему краю кнопки (открываем вверх)
        topPosition = btnRect.bottom - popupHeight
      }

      // Дополнительная проверка, чтобы попап не вылезал за верхний край экрана
      if (topPosition < 0) {
        topPosition = 0 // Прижимаем к верху
      }

      setStyle({
        position: 'fixed',
        left: btnRect.right,
        top: topPosition,
        visibility: 'visible', // Делаем видимым после расчета
      })
    } else {
      // Сбрасываем стили, если попап закрыт
      setStyle(null)
    }
    // Зависим от `children`, так как их изменение может повлиять на высоту попапа.
  }, [isCollapsedOpen, btnRef, children])

  if (!isCollapsedOpen) {
    return null
  }

  // Изначально рендерим портал, но сам попап невидимый.
  // Это нужно, чтобы `useLayoutEffect` мог измерить его высоту.
  const initialStyle: React.CSSProperties = {
    visibility: 'hidden',
  }

  return createPortal(
    <>
      {/* Клик вне элементов popup */}
      <div className="fixed inset-0 z-40" onClick={closeSubMenu} />
      <div
        ref={containerRef}
        className="fixed z-50 max-h-[50vh] w-70 overflow-y-auto bg-gray-50 shadow-lg dark:bg-[#0e1523]"
        // Сначала применяем initialStyle, а после расчета - вычисленный style
        style={style || initialStyle}
      >
        {children}
      </div>
    </>,
    document.body,
  )
}

export default Popup

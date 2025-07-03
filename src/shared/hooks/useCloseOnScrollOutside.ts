import { useCallback, useEffect } from 'react'
import type DatePicker from 'react-datepicker'

/**
 * Кастомный хук, который закрывает DatePicker при скролле вне его.
 * @param isOpen - Открыт ли в данный момент календарь.
 * @param datePickerRef - Ref на экземпляр DatePicker.
 */
export function useCloseOnScrollOutside(
  isOpen: boolean,
  // 👇 ИЗМЕНЕНИЕ ЗДЕСЬ: указываем, что ref.current может быть null
  datePickerRef: React.RefObject<DatePicker | null>,
) {
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const target = event.target as HTMLElement

      if (target.closest('.react-datepicker-popper')) {
        return
      }

      // Этот код уже был безопасен благодаря `?.`
      if (isOpen) {
        datePickerRef.current?.setOpen(false)
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }
    },
    [isOpen, datePickerRef],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('wheel', handleWheel)
    }
    return () => {
      document.removeEventListener('wheel', handleWheel)
    }
  }, [isOpen, handleWheel])
}

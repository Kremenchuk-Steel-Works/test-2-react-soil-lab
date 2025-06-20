import { forwardRef, useCallback } from 'react'
import { useMergeRefs } from '@floating-ui/react'
import { useMask } from '@react-input/mask'
import InputField, { type InputFieldProps } from '@/shared/ui/input-field/InputField'

/**
 * Финальная, контекстно-зависимая функция для коррекции и форматирования строки даты.
 * @param str - Текущая строка в поле ввода
 * @param cursorPosition - Текущая позиция курсора
 * @returns Модифицированная строка
 */
const getCorrectedDateString = (str: string, cursorPosition: number | null): string => {
  const parts = str.split('.')

  // --- Улучшения для Дня (dd) ---
  if (parts[0]) {
    // Ключевое изменение: проверяем, что курсор находится СРАЗУ ПОСЛЕ ПЕРВОГО СИМВОЛА дня.
    // Это работает и для вставки, и для замены.
    if (cursorPosition === 1 && parseInt(str.charAt(0), 10) > 3) {
      // Заменяем всю часть дня на "0" + введенный символ.
      // Это правильно обработает случай '15' -> выделяем '1', вводим '4' -> '04'
      parts[0] = '0' + str.charAt(0)
    }

    // Общая логика валидации дня (работает с уже потенциально измененной частью)
    const dayPart = parts[0].replace(/\D/g, '')
    if (parseInt(dayPart, 10) > 31) parts[0] = '31'
    if (dayPart === '00') parts[0] = '01'
  }

  // --- Улучшения для Месяца (mm) ---
  if (parts[1]) {
    // Аналогичная проверка для месяца: курсор сразу после первого символа месяца.
    if (cursorPosition === 4 && parseInt(str.charAt(3), 10) > 1) {
      // Заменяем всю часть месяца
      parts[1] = '0' + str.charAt(3)
    }

    // Общая логика валидации месяца
    const monthPart = parts[1].replace(/\D/g, '')
    if (parseInt(monthPart, 10) > 12) parts[1] = '12'
    if (monthPart === '00') parts[1] = '01'
  }

  // --- Коррекция Года (yyyy) ---
  if (parts[2]) {
    const yearPart = parts[2].replace(/\D/g, '')
    if (yearPart.length === 4 && yearPart === '0000') {
      parts[2] = '0001'
    }
  }

  return parts.join('.')
}

// Расширяем пропсы, чтобы включить стандартные атрибуты инпута, включая onChange
type InputFieldWithMaskProps = InputFieldProps & React.InputHTMLAttributes<HTMLInputElement>

const InputFieldWithMask = forwardRef<HTMLInputElement, InputFieldWithMaskProps>(
  ({ label, onChange, ...props }, ref) => {
    const inputRef = useMask({
      mask: 'дд.мм.рррр',
      replacement: { д: /\d/, м: /\d/, р: /\d/ },
      showMask: false,
      separate: true,
    })

    const mergedRefs = useMergeRefs([inputRef, ref])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target
        const originalValue = input.value
        const originalCursorPosition = input.selectionStart

        const correctedValue = getCorrectedDateString(originalValue, originalCursorPosition)

        if (originalValue !== correctedValue) {
          input.value = correctedValue

          if (originalCursorPosition !== null) {
            const newCursorPosition =
              originalCursorPosition + (correctedValue.length - originalValue.length)

            requestAnimationFrame(() => {
              input.setSelectionRange(newCursorPosition, newCursorPosition)
            })
          }
        }

        if (onChange) {
          onChange(e)
        }
      },
      [onChange],
    )

    return <InputField {...props} label={label} ref={mergedRefs} onChange={handleChange} />
  },
)

export default InputFieldWithMask

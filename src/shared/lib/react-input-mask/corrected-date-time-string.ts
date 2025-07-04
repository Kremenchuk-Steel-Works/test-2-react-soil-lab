import { getCorrectedDateString } from '@/shared/lib/react-input-mask/corrected-date-string'
import { getCorrectedTimeString } from '@/shared/lib/react-input-mask/corrected-time-string'

/**
 * Корректирует строку, содержащую дату и время (дд.мм.гггг чч:мм).
 * @param str - Входная строка, например "12.03.2024 15:3".
 * @param cursorPosition - Позиция курсора.
 * @returns Отформатированная и скорректированная строка.
 */
export const getCorrectedDateTimeString = (str: string, cursorPosition: number | null): string => {
  const parts = str.split(' ')
  const dateStr = parts[0] || ''
  const timeStr = parts[1] || ''

  let correctedDate = dateStr
  let correctedTime = timeStr

  // Длина части с датой 'dd.MM.yyyy' - 10 символов.
  // Если курсор находится в этой части, корректируем только дату.
  if (cursorPosition === null || cursorPosition <= 10) {
    correctedDate = getCorrectedDateString(dateStr, cursorPosition)
  }

  // Если курсор находится в части времени (позиция > 10, т.к. есть пробел),
  // корректируем только время.
  // Важно передать относительную позицию курсора для `getCorrectedTimeString`.
  if (cursorPosition !== null && cursorPosition > 10) {
    // Позиция курсора внутри строки времени (str.length 'dd.MM.yyyy ' = 11)
    const timeCursorPosition = cursorPosition - 11
    correctedTime = getCorrectedTimeString(timeStr, timeCursorPosition)
  }

  // Собираем строку обратно. Если есть только дата, timePart будет пустой.
  return [correctedDate, correctedTime].filter(Boolean).join(' ')
}

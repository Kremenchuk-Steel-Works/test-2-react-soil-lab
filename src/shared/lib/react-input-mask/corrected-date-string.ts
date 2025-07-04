/**
 * Контекстно-зависимая функция для коррекции и форматирования строки даты.
 * @param str - Текущая строка в поле ввода
 * @param cursorPosition - Текущая позиция курсора
 * @returns Модифицированная строка
 */
export const getCorrectedDateString = (str: string, cursorPosition: number | null): string => {
  const parts = str.split('.')

  if (parts[0]) {
    // Проверяем, что курсор находится СРАЗУ ПОСЛЕ ПЕРВОГО СИМВОЛА дня.
    if (cursorPosition === 1 && parseInt(str.charAt(0), 10) > 3) {
      // Заменяем всю часть дня на "0" + введенный символ.
      parts[0] = '0' + str.charAt(0)
    }

    // Общая логика валидации дня (работает с уже потенциально измененной частью)
    const dayPart = parts[0].replace(/\D/g, '')
    if (parseInt(dayPart, 10) > 31) parts[0] = '31'
    if (dayPart === '00') parts[0] = '01'
  }

  // Для Месяца (mm) ---
  if (parts[1]) {
    // Курсор сразу после первого символа месяца.
    if (cursorPosition === 4 && parseInt(str.charAt(3), 10) > 1) {
      // Заменяем всю часть месяца
      parts[1] = '0' + str.charAt(3)
    }

    // Общая логика валидации месяца
    const monthPart = parts[1].replace(/\D/g, '')
    if (parseInt(monthPart, 10) > 12) parts[1] = '12'
    if (monthPart === '00') parts[1] = '01'
  }

  // Коррекция Года (yyyy)
  if (parts[2]) {
    const yearPart = parts[2].replace(/\D/g, '')
    if (yearPart.length === 4 && yearPart === '0000') {
      parts[2] = '0001'
    }
  }

  return parts.join('.')
}

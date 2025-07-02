/**
 * Контекстно-зависимая функция для коррекции и форматирования строки времени (HH:mm).
 * @param str - Текущая строка в поле ввода, например "25:10" или "4:".
 * @param cursorPosition - Текущая позиция курсора.
 * @returns Модифицированная и отформатированная строка.
 */
export const getCorrectedTimeString = (str: string, cursorPosition: number | null): string => {
  const parts = str.split(':')

  // --- Коррекция Часов (HH) ---
  if (parts[0]) {
    // Если пользователь вводит цифру > 2 как первый символ (например, "4"),
    // автоматически добавляем впереди "0", чтобы получилось "04".
    if (cursorPosition === 1 && parseInt(str.charAt(0), 10) > 2) {
      parts[0] = '0' + str.charAt(0)
    }

    // Общая валидация часов. Если введено значение > 23, заменяем на "23".
    const hourPart = parts[0].replace(/\D/g, '')
    if (parseInt(hourPart, 10) > 23) {
      parts[0] = '23'
    }
  }

  // --- Коррекция Минут (mm) ---
  if (parts[1]) {
    // Если пользователь вводит цифру > 5 как первый символ минут (например, "12:7"),
    // автоматически добавляем впереди "0", чтобы получилось "12:07".
    // Курсор в этот момент находится в позиции 4.
    if (cursorPosition === 4 && parseInt(str.charAt(3), 10) > 5) {
      parts[1] = '0' + str.charAt(3)
    }

    // Общая валидация минут. Если введено значение > 59, заменяем на "59".
    const minutePart = parts[1].replace(/\D/g, '')
    if (parseInt(minutePart, 10) > 59) {
      parts[1] = '59'
    }
  }

  return parts.join(':')
}

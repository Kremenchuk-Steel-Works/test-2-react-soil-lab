/**
 * Конвертирует объект JavaScript в экземпляр FormData.
 * Пропускает null и undefined значения.
 * @param data - Объект с данными для конвертации.
 * @returns Экземпляр FormData.
 */
export function objectToFormData(data: Record<string, any>): FormData {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    // Пропускаем null и undefined значения, чтобы не отправлять их на бэкенд
    if (value === null || value === undefined) {
      return
    }

    // Если значение - это File, добавляем его как файл.
    // Иначе - конвертируем в строку.
    if (value instanceof File) {
      formData.append(key, value, value.name)
    } else {
      formData.append(key, String(value))
    }
  })

  return formData
}

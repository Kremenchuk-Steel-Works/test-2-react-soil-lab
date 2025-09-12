import type { AxiosResponse } from 'axios'

/**
 * Инициирует скачивание файла в браузере из ответа Axios.
 * Пытается извлечь имя файла из заголовка 'Content-Disposition'.
 *
 * @param response - Объект ответа Axios, содержащий данные файла в виде Blob.
 * @param fallbackFilename - Имя файла по умолчанию, если его не удалось извлечь из заголовков.
 */
export function downloadFile(response: AxiosResponse<Blob>, fallbackFilename = 'file'): void {
  // Пытаемся получить имя файла из заголовков
  const contentDisposition = response.headers['content-disposition'] as string
  let filename = fallbackFilename

  if (contentDisposition) {
    const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
    if (filenameMatch?.[1]) {
      // Убираем кавычки и декодируем URI-компоненты (например, пробелы %20)
      filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''))
    }
  }

  // Данные файла
  const blob = response.data
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()

  link.remove()
  window.URL.revokeObjectURL(url)
}

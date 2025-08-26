export function toSafeUrl(src: string): string {
  // кодирует пробелы, кавычки «», неразрывные пробелы и пр., но не трогает слэши
  try {
    return encodeURI(src)
  } catch {
    return src
  }
}

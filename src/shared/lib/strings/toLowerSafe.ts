export const toLowerSafe = (v: unknown): string => {
  switch (typeof v) {
    case 'string':
      return v.toLowerCase()
    case 'number':
    case 'boolean':
    case 'bigint':
      return String(v).toLowerCase()
    default:
      return ''
  }
}

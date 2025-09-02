import type { FieldError, FieldErrors, FieldValues, Path } from 'react-hook-form'

/** Узкий type guard для ошибок RHF */
function isFieldError(value: unknown): value is FieldError {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('message' in value || 'type' in value || 'ref' in value || 'types' in value)
  )
}

/** Универсальная проверка на индексируемый объект/массив */
function isIndexable(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getNestedError<T extends FieldValues>(
  errors: FieldErrors<T>,
  path: Path<T>,
): FieldError | undefined {
  const pathParts = String(path).split('.')

  let current: unknown = errors
  for (const part of pathParts) {
    if (!isIndexable(current)) return undefined
    current = current[part]
    if (current == null) return undefined
  }

  // RHF + zod для useFieldArray может класть ошибку в "root"
  if (isFieldError(current)) return current
  if (isIndexable(current)) {
    const root = current['root']
    if (isFieldError(root)) return root
  }

  return undefined
}

export function getNestedErrorMessage<T extends FieldValues>(
  errors: FieldErrors<T>,
  path: Path<T>,
): string | undefined {
  const node = getNestedError(errors, path)
  if (!node) return undefined

  if (typeof node.message === 'string') return node.message
  return undefined
}

export const formTransformers = {
  number: {
    setValueAs: (v: unknown) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  },
  string: {
    setValueAs: (v: unknown) => {
      if (typeof v !== 'string') return v
      const trimmed = v.trim()
      return trimmed === '' ? undefined : trimmed
    },
  },
}

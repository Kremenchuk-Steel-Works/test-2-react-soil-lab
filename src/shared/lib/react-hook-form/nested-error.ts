import type { FieldError, FieldErrors, FieldValues, Path } from 'react-hook-form'

function getNestedError<T extends FieldValues>(
  errors: FieldErrors<T>,
  path: Path<T>,
): FieldError | undefined {
  const pathParts = (path as string).split('.')

  let currentError: any = errors
  for (const part of pathParts) {
    if (!currentError) return undefined
    currentError = currentError[part]
  }

  return currentError as FieldError
}

export function getNestedErrorMessage<T extends FieldValues>(
  errors: FieldErrors<T>,
  path: Path<T>,
): string | undefined {
  const node = getNestedError(errors, path) as any
  if (!node) return undefined

  // обычная ошибка поля
  if (typeof node?.message === 'string') return node.message

  // ошибка на "корне" массива (RHF + zod для useFieldArray)
  if (typeof node?.root?.message === 'string') return node.root.message

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

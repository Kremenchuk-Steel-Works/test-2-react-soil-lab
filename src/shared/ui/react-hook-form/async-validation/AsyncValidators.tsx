import type { QueryKey } from '@tanstack/react-query'
import type { FieldValues, Path } from 'react-hook-form'
import { AsyncFieldValidator } from '@/shared/ui/react-hook-form/async-validation/AsyncFieldValidator'

export type AsyncValidatorConfig<T extends FieldValues> = {
  validationFn: (value: string, signal: AbortSignal) => Promise<boolean>
  queryKeyFn: (fieldName: Path<T>, value: string) => QueryKey
  errorMessage: string
}

type AsyncValidatorsProps<T extends FieldValues> = {
  config: Partial<Record<Path<T>, AsyncValidatorConfig<T>>>
  debounceMs?: number
  onStatusChange?: (name: Path<T>, isChecking: boolean) => void
  onErrorChange?: (name: Path<T>, hasError: boolean) => void
}

export function AsyncValidators<T extends FieldValues>({
  config,
  debounceMs,
  onStatusChange,
  onErrorChange,
}: AsyncValidatorsProps<T>) {
  return (
    <>
      {(Object.keys(config) as Path<T>[]).map((fieldName) => {
        const fieldConfig = config[fieldName]
        if (!fieldConfig) return null

        return (
          <AsyncFieldValidator
            key={fieldName as string}
            name={fieldName}
            config={fieldConfig}
            debounceMs={debounceMs}
            onStatusChange={onStatusChange}
            onErrorChange={onErrorChange}
          />
        )
      })}
    </>
  )
}

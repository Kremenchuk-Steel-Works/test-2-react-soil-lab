import {
  Controller,
  type ArrayPath,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from 'react-hook-form'
import { coreBatchService } from '@/entities/molding-shop/core-batch/api/service'
import type { MoldCoreFormFields } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'
import type { CountryLookupResponse } from '@/shared/api/main-service/model'
import { useSelectOptions } from '@/shared/hooks/react-hook-form/options/useSelectOptions'
import { useParallelQueries } from '@/shared/hooks/react-query/useParallelQueries'
import { getErrorMessage } from '@/shared/lib/axios'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = MoldCoreFormFields

interface FormProps<T extends FieldValues> {
  index: number
  name: ArrayPath<T>
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function MoldCoreForm<T extends FieldValues>({
  index,
  name,
  control,
  register,
  errors,
}: FormProps<T>) {
  // Queries
  const {
    data: queriesData,
    isLoading: isQueriesLoading,
    error: queriesError,
  } = useParallelQueries({
    coreBatches: coreBatchService.getLookup(),
  })

  // Loading || Error
  if (isQueriesLoading) return
  if (queriesError) {
    return <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queriesError)} />
  }

  // Options
  const coreBatchesOptions = useSelectOptions(
    queriesData?.coreBatches as CountryLookupResponse[] | undefined,
    {
      getValue: (c) => c.id,
      getLabel: (c) => c.name,
    },
  )

  // Динамически строим пути к полям
  const fieldName = (field: keyof FormFields) => `${name}.${index}.${field}` as Path<T>

  return (
    <>
      <Controller
        name={fieldName('coreBatchId')}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={coreBatchesOptions}
            isVirtualized
            isClearable
            placeholder="Партія"
            errorMessage={getNestedErrorMessage(errors, fieldName('coreBatchId'))}
          />
        )}
      />

      <InputFieldWithError
        label="Твердість, од."
        {...register(fieldName('hardness'), formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, fieldName('hardness'))}
      />
    </>
  )
}

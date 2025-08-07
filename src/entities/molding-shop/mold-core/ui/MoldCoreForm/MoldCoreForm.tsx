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
import type {
  MoldCoreBatchLookupResponse,
  MoldCoreBatchLookupsListResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptionsNew'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
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
  const loadCoreBatchesOptions = useAsyncOptionsNew<MoldCoreBatchLookupResponse, string>(
    coreBatchService.getLookup,
    {
      paramsBuilder: (search, page) => ({
        search,
        page,
        pageSize: 20,
      }),
      responseAdapter: (data: MoldCoreBatchLookupsListResponse) => ({
        items: data.data,
        hasMore: data.data.length < data.totalItems,
      }),
      mapper: (item) => ({
        value: item.id,
        label: `${item.moldingSandType.name} ${item.moldCoreType.modelNumber} ${item.machine.brand} ${item.machine.model} ${item.manufacturingTimestamp} ${item.batchExpiryDate}`,
      }),
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
            options={loadCoreBatchesOptions}
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

import {
  Controller,
  type ArrayPath,
  type Control,
  type DeepPartial,
  type FieldArray,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from 'react-hook-form'
import { castingPatternService } from '@/entities/molding-shop/casting-pattern/api/service'
import type { MoldCavityFormFields } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
import { MoldCoreForm } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/MoldCoreForm'
import { moldCoreFormDefaultValues } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'
import type {
  CastingPatternLookupResponse,
  CastingPatternLookupsListResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptionsNew'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { CheckboxWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = MoldCavityFormFields

interface FormProps<T extends FieldValues> {
  index: number
  name: ArrayPath<T>
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function MoldCavityForm<T extends FieldValues>({
  index,
  name,
  control,
  register,
  errors,
}: FormProps<T>) {
  const loadCastingPatternsOptions = useAsyncOptionsNew<CastingPatternLookupResponse, string>(
    castingPatternService.getLookup,
    {
      paramsBuilder: (search, page) => ({
        search,
        page,
        pageSize: 20,
      }),
      responseAdapter: (data: CastingPatternLookupsListResponse) => ({
        items: data.data,
        hasMore: data.data.length < data.totalItems,
      }),
      mapper: (item) => ({
        value: item.id,
        label: item.serialNumber,
      }),
    },
  )

  // Динамически строим пути к полям
  const fieldName = (field: keyof FormFields) => `${name}.${index}.${field}` as Path<T>

  // Формируем полный путь до вложенного массива
  const coresFieldName = `${name}.${index}.moldCores`

  return (
    <>
      <Controller
        name={fieldName('castingPatternId')}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={loadCastingPatternsOptions}
            isVirtualized
            isClearable
            placeholder="Модель"
            errorMessage={getNestedErrorMessage(errors, fieldName('castingPatternId'))}
          />
        )}
      />

      <InputFieldWithError
        label="Серійний номер"
        {...register(fieldName('serialNumber'), formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, fieldName('serialNumber'))}
      />

      <CheckboxWithError
        label="Придатне для заливання металу"
        {...register(fieldName('isFunctional'), formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, fieldName('isFunctional'))}
      />

      {/* Cores */}
      <DynamicFieldArray
        title="Стрижень"
        label="стрижень"
        name={coresFieldName as ArrayPath<T>}
        form={MoldCoreForm}
        defaultItem={moldCoreFormDefaultValues as DeepPartial<FieldArray<T, ArrayPath<T>>>}
        control={control}
        register={register}
        errors={errors}
      />
    </>
  )
}

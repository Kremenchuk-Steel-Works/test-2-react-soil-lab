import { memo, useMemo } from 'react'
import { Controller, useFormContext, useWatch, type Path } from 'react-hook-form'
import { castingPatternService } from '@/entities/molding-shop/casting-pattern/api/service'
import { MoldCoreForm } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/MoldCoreForm'
import { moldCoreFormDefaultValues } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'
import type { MoldPassportFormFields } from '@/entities/molding-shop/mold-passport'
import type {
  CastingPatternLookupResponse,
  CastingPatternLookupsListResponse,
  MoldPassportDetailResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptionsNew'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { CheckboxWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

interface FormProps {
  index: number
  name: 'moldCavities'
  responseData?: MoldPassportDetailResponse
}

export function MoldCavityFormComponent({ index, name, responseData }: FormProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<MoldPassportFormFields>()

  // Динамически строим пути к полям
  type FormFields = MoldPassportFormFields['moldCavities'][number]
  const fieldName = (field: keyof FormFields) =>
    `${name}.${index}.${field}` as Path<MoldPassportFormFields>

  const currentItemPath = `${name}.${index}` as const
  const item = useWatch({
    control,
    name: currentItemPath,
  })

  const cavityFromResponse = useMemo(
    () => responseData?.moldCavities?.find((c) => c.id === item?.id),
    [responseData, item?.id],
  )

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

  const defaultCastingPatternsOptions = useDefaultOption(
    cavityFromResponse?.castingPattern,
    (d) => ({ value: d.id, label: d.serialNumber }),
  )

  // Формируем полный путь до вложенного массива
  const coresFieldName = `${name}.${index}.moldCores` as const

  type MemoizedFormProps = {
    index: number
    name: typeof coresFieldName
  }

  const MemoizedMoldCoreForm = ({ index: coreIndex, name: coreName }: MemoizedFormProps) => {
    return (
      <MoldCoreForm
        index={coreIndex}
        cavityId={item?.id}
        name={coreName}
        responseData={responseData}
      />
    )
  }

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
            defaultOptions={defaultCastingPatternsOptions}
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
        label="Придатний для заливання металу"
        {...register(fieldName('isFunctional'), formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, fieldName('isFunctional'))}
      />

      {/* Cores */}
      <DynamicFieldArray
        title="Стрижень"
        label="стрижень"
        name={coresFieldName}
        form={MemoizedMoldCoreForm}
        defaultItem={moldCoreFormDefaultValues}
        responseData={responseData}
      />
    </>
  )
}

export const MoldCavityForm = memo(MoldCavityFormComponent)

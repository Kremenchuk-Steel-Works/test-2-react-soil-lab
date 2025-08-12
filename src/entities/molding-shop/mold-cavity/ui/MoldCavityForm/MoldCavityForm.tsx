import { memo, useCallback, useMemo } from 'react'
import {
  Controller,
  useFormState,
  type Control,
  type Path,
  type UseFormRegister,
} from 'react-hook-form'
import { castingPatternService } from '@/entities/molding-shop/casting-pattern/api/service'
import type { MoldCavityFormFields } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
import {
  MoldCoreForm,
  type MoldCoreItemData,
} from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/MoldCoreForm'
import { moldCoreFormDefaultValues } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'
import type { MoldPassportFormFields } from '@/entities/molding-shop/mold-passport'
import type {
  CastingPatternLookupResponse,
  CastingPatternLookupsListResponse,
  MoldPassportDetailResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptionsNew'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { createLogger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { CheckboxWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

const logger = createLogger('MoldCavityForm')

export type MoldCavityPathPrefix = `moldCavities.${number}`
export type MoldCavityItemData = MoldPassportDetailResponse['moldCavities'][number]

interface FormProps {
  pathPrefix: MoldCavityPathPrefix
  itemData?: MoldCavityItemData
  control: Control<MoldPassportFormFields>
  register: UseFormRegister<MoldPassportFormFields>
}

export function MoldCavityFormComponent({ pathPrefix, itemData, control, register }: FormProps) {
  const fieldName = useCallback(
    (field: keyof MoldCavityFormFields) => `${pathPrefix}.${field}` as Path<MoldPassportFormFields>,
    [pathPrefix],
  )

  // Подписываемся только на ошибки текущих полей
  const watchedErrorNames = useMemo(
    () => [fieldName('castingPatternId'), fieldName('serialNumber'), fieldName('isFunctional')],
    [fieldName],
  )
  const { errors } = useFormState<MoldPassportFormFields>({ control, name: watchedErrorNames })

  // Options
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

  const defaultCastingPatternsOptions = useDefaultOption(itemData?.castingPattern, (d) => ({
    value: d.id,
    label: d.serialNumber,
  }))

  // Формируем полный путь до вложенного массива
  const coresFieldName = useMemo(() => `${pathPrefix}.moldCores` as const, [pathPrefix])

  logger.debug('[MoldCavityForm] render')

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
        {...register(fieldName('isFunctional'))} // formTransformers не нужен для checkbox
        errorMessage={getNestedErrorMessage(errors, fieldName('isFunctional'))}
      />

      {/* Cores */}
      <DynamicFieldArray<MoldPassportFormFields, typeof coresFieldName, MoldCoreItemData>
        title="Стрижень"
        label="стрижень"
        name={coresFieldName}
        form={MoldCoreForm}
        defaultItem={moldCoreFormDefaultValues}
        itemsData={itemData?.moldCores}
      />
    </>
  )
}

export const MoldCavityForm = memo(MoldCavityFormComponent)

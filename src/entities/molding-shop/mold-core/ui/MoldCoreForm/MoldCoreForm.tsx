import { memo, useCallback, useMemo } from 'react'
import {
  Controller,
  useFormState,
  type Control,
  type Path,
  type UseFormRegister,
} from 'react-hook-form'
import { coreBatchService } from '@/entities/molding-shop/core-batch/api/service'
import type {
  MoldCavityItemData,
  MoldCavityPathPrefix,
} from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/MoldCavityForm'
import type { MoldCoreFormFields } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'
import type { MoldPassportFormFields } from '@/entities/molding-shop/mold-passport'
import type {
  MoldCoreBatchLookupResponse,
  MoldCoreBatchLookupsListResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptionsNew'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { createLogger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

const logger = createLogger('MoldCoreForm')

export type MoldCorePathPrefix = `${MoldCavityPathPrefix}.moldCores.${number}`
export type MoldCoreItemData = MoldCavityItemData['moldCores'][number]

interface FormProps {
  pathPrefix: MoldCorePathPrefix
  itemData?: MoldCoreItemData
  control: Control<MoldPassportFormFields>
  register: UseFormRegister<MoldPassportFormFields>
}

const formatCoreBatchLabel = (d: MoldCoreBatchLookupResponse) =>
  `${d.moldingSandType.name} ${d.moldCoreType.modelNumber} ${d.moldCoreMakingMachine.brand} ${d.moldCoreMakingMachine.model} ${d.manufacturingTimestamp} ${d.batchExpiryDate}`

export function MoldCoreFormComponent({ pathPrefix, itemData, control, register }: FormProps) {
  const fieldName = useCallback(
    (field: keyof MoldCoreFormFields) => `${pathPrefix}.${field}` as Path<MoldPassportFormFields>,
    [pathPrefix],
  )

  // Подписка только на свои ошибки
  const watchedErrorNames = useMemo(
    () => [fieldName('coreBatchId'), fieldName('hardness')],
    [fieldName],
  )
  const { errors } = useFormState<MoldPassportFormFields>({ control, name: watchedErrorNames })

  // Options
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
        label: formatCoreBatchLabel(item),
      }),
    },
  )

  const defaultCoreBatchesOptions = useDefaultOption(itemData?.coreBatch, (d) => ({
    value: d.id,
    label: formatCoreBatchLabel(d),
  }))

  logger.debug('[MoldCoreForm] render')

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
            defaultOptions={defaultCoreBatchesOptions}
            isVirtualized
            isClearable
            placeholder="Партія"
            errorMessage={getNestedErrorMessage(errors, fieldName('coreBatchId'))}
          />
        )}
      />

      <InputFieldWithError
        label="Твердість, од."
        {...register(fieldName('hardness'), formTransformers.number)}
        errorMessage={getNestedErrorMessage(errors, fieldName('hardness'))}
      />
    </>
  )
}

export const MoldCoreForm = memo(MoldCoreFormComponent)

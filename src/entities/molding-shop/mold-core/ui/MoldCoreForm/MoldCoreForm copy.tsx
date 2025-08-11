import { memo, useMemo } from 'react'
import { Controller, useFormContext, useWatch, type Path } from 'react-hook-form'
import { coreBatchService } from '@/entities/molding-shop/core-batch/api/service'
import type { MoldPassportFormFields } from '@/entities/molding-shop/mold-passport'
import type {
  MoldCoreBatchLookupResponse,
  MoldCoreBatchLookupsListResponse,
  MoldPassportDetailResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptionsNew'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

interface FormProps {
  index: number
  name: `moldCavities.${number}.moldCores`
  cavityId?: string
  responseData?: MoldPassportDetailResponse
}

export function MoldCoreFormComponent({ index, name, cavityId, responseData }: FormProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<MoldPassportFormFields>()

  // Динамически строим пути к полям
  type FormFields = MoldPassportFormFields['moldCavities'][number]['moldCores'][number]
  const fieldName = (field: keyof FormFields) =>
    `${name}.${index}.${field}` as Path<MoldPassportFormFields>

  const currentItemPath = `${name}.${index}` as const
  const coreItem = useWatch({
    control,
    name: currentItemPath,
  })

  const coreFromResponse = useMemo(() => {
    if (!cavityId || !coreItem?.id) return undefined
    const cavity = responseData?.moldCavities?.find((c) => c.id === cavityId)
    return cavity?.moldCores?.find((c) => c.id === coreItem.id)
  }, [responseData, cavityId, coreItem?.id])

  const formatCoreBatchLabel = (data: MoldCoreBatchLookupResponse) =>
    `${data.moldingSandType.name} ${data.moldCoreType.modelNumber} ${data.machine.brand} ${data.machine.model} ${data.manufacturingTimestamp} ${data.batchExpiryDate}`

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

  const defaultCoreBatchesOptions = useDefaultOption(coreFromResponse?.coreBatch, (d) => ({
    value: d.id,
    label: formatCoreBatchLabel(d),
  }))

  console.log('MoldCoreFormComponent render')

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

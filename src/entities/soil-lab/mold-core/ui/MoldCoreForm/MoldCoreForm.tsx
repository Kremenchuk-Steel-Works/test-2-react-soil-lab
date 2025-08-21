import { memo, useCallback } from 'react'
import { type Path } from 'react-hook-form'
import { coreBatchService } from '@/entities/soil-lab/core-batch/api/service'
import type {
  MoldCavityItemData,
  MoldCavityPathPrefix,
} from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/MoldCavityForm'
import type { MoldCoreFormFields } from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/schema'
import type { MoldPassportFormFields } from '@/entities/soil-lab/mold-passport'
import { MoldPassportFormKit } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/FormKit'
import type { MoldCoreBatchLookupResponse } from '@/shared/api/mold-passport/model'
import { useAsyncOptions } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { createLogger } from '@/shared/lib/logger'
import InputField from '@/shared/ui/input-field/InputField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'

const logger = createLogger('MoldCoreForm')

export type MoldCorePathPrefix = `${MoldCavityPathPrefix}.moldCores.${number}`
export type MoldCoreItemData = MoldCavityItemData['moldCores'][number]

interface FormProps {
  pathPrefix: MoldCorePathPrefix
  itemData?: MoldCoreItemData
}

const Form = MoldPassportFormKit

const formatCoreBatchLabel = (d: MoldCoreBatchLookupResponse) =>
  `${d.moldingSandType.name} ${d.moldCoreType.modelNumber} ${d.moldCoreMakingMachine.brand} ${d.moldCoreMakingMachine.model} ${d.manufacturingTimestamp} ${d.batchExpiryDate}`

export function MoldCoreFormComponent({ pathPrefix, itemData }: FormProps) {
  const fieldName = useCallback(
    (field: keyof MoldCoreFormFields) => `${pathPrefix}.${field}` as Path<MoldPassportFormFields>,
    [pathPrefix],
  )

  // Options
  const loadCoreBatchesOptions = useAsyncOptions(coreBatchService.getLookup, {
    paramsBuilder: (search, page) => ({
      search,
      page,
      pageSize: 20,
    }),
    responseAdapter: (data) => ({
      items: data.data,
      hasMore: data.data.length < data.totalItems,
    }),
    mapper: (item) => ({
      value: item.id,
      label: formatCoreBatchLabel(item),
    }),
  })

  const defaultCoreBatchesOptions = useDefaultOption(itemData?.coreBatch, (d) => ({
    value: d.id,
    label: formatCoreBatchLabel(d),
  }))

  logger.debug('[MoldCoreForm] render')

  return (
    <>
      <Form.Controller name={fieldName('coreBatchId')}>
        {({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={loadCoreBatchesOptions}
            defaultOptions={defaultCoreBatchesOptions}
            isVirtualized
            isClearable
            placeholder="Партія"
          />
        )}
      </Form.Controller>

      <Form.Field name={fieldName('hardness')}>
        {({ register }) => <InputField label="Твердість, од." {...register} />}
      </Form.Field>
    </>
  )
}

export const MoldCoreForm = memo(MoldCoreFormComponent)

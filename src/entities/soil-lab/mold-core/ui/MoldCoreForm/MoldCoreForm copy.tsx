import { memo, useCallback } from 'react'
import { type Path } from 'react-hook-form'
import type { MoldCavityPathPrefix } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/MoldCavityForm copy'
import { useMoldCoreFormOptions } from '@/entities/soil-lab/mold-core/hooks/useMoldCoreFormOptions'
import type {
  MoldCoreFormFields,
  WithMoldCoresFormFields,
} from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/schema'
import type { MoldCoreDetailResponse } from '@/shared/api/mold-passport/model'
import { createLogger } from '@/shared/lib/logger'
import InputField from '@/shared/ui/input-field/InputField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/formKitContext'

const logger = createLogger('MoldCoreForm')

export type MoldCorePathPrefix = `${MoldCavityPathPrefix}.moldCores.${number}`

interface FormProps {
  pathPrefix: MoldCorePathPrefix
  itemData?: MoldCoreDetailResponse
}

export function MoldCoreFormComponent({ pathPrefix, itemData }: FormProps) {
  const Form = useFormKit()
  const fieldName = useCallback(
    (field: keyof MoldCoreFormFields) => `${pathPrefix}.${field}` as Path<WithMoldCoresFormFields>,
    [pathPrefix],
  )

  // Options
  const options = useMoldCoreFormOptions(itemData)

  logger.debug('[MoldCoreForm] render')

  return (
    <>
      <Form.Controller name={fieldName('coreBatchId')}>
        {({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={options.loadCoreBatches}
            defaultOptions={options.defaultCoreBatches}
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

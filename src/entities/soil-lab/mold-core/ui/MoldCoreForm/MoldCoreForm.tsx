import { memo } from 'react'
import { type ArrayPath, type FieldValues } from 'react-hook-form'
import { useMoldCoreFormOptions } from '@/entities/soil-lab/mold-core/hooks/useMoldCoreFormOptions'
import type { MoldCoreFormFields } from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/schema'
import type { MoldCoreDetailResponse } from '@/shared/api/mold-passport/model'
import { useScopedFieldName } from '@/shared/hooks/react-hook-form/useFieldName'
import { createLogger } from '@/shared/lib/logger'
import InputField from '@/shared/ui/input-field/InputField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

const logger = createLogger('MoldCoreForm')

interface FormProps<T extends FieldValues, N extends ArrayPath<T> = ArrayPath<T>> {
  pathPrefix: `${N}.${number}`
  itemData?: MoldCoreDetailResponse
}

export function MoldCoreFormComponent<T extends FieldValues, N extends ArrayPath<T>>({
  pathPrefix,
  itemData,
}: FormProps<T, N>) {
  const Form = useFormKit<T>()
  const fieldName = useScopedFieldName<T, MoldCoreFormFields>(pathPrefix)

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

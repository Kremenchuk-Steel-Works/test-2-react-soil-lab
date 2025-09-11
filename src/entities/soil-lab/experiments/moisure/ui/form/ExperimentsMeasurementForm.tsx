import { memo } from 'react'
import { type ArrayPath, type FieldValues } from 'react-hook-form'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisure/model/fields-registry'
import type { ExperimentsMeasurementFormFields } from '@/entities/soil-lab/experiments/moisure/ui/form/schema'
import { useScopedFieldName } from '@/shared/hooks/react-hook-form/useFieldName'
import { createLogger } from '@/shared/lib/logger'
import InputField from '@/shared/ui/input-field/InputField'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

const logger = createLogger('ExperimentsMeasurementForm')

interface FormProps<T extends FieldValues, N extends ArrayPath<T> = ArrayPath<T>> {
  pathPrefix: `${N}.${number}`
}

export function ExperimentsMeasurementFormComponent<T extends FieldValues, N extends ArrayPath<T>>({
  pathPrefix,
}: FormProps<T, N>) {
  const Form = useFormKit<T>()
  const fieldName = useScopedFieldName<T, ExperimentsMeasurementFormFields>(pathPrefix)

  const { moistureContentPercent } = moistureFieldRegistry

  logger.debug('[ExperimentsMeasurementForm] render')

  return (
    <>
      <Form.Field name={fieldName(moistureContentPercent.key)}>
        {({ register }) => (
          <InputField label={moistureContentPercent.label.default} {...register} />
        )}
      </Form.Field>
    </>
  )
}

export const ExperimentsMeasurementForm = memo(ExperimentsMeasurementFormComponent)

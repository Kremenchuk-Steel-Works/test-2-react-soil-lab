import { memo } from 'react'
import { type ArrayPath, type FieldValues } from 'react-hook-form'
import { EXPERIMENTS as FR } from '@/entities/soil-lab/experiments/model/fields-registry'
import type { ExperimentsMeasurementFormFields } from '@/entities/soil-lab/experiments/ui/form/schema'
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

  logger.debug('[ExperimentsMeasurementForm] render')

  return (
    <>
      <Form.Field name={fieldName(FR.moistureContentPercent.key)}>
        {({ register }) => (
          <InputField label={FR.moistureContentPercent.label.default} {...register} />
        )}
      </Form.Field>
    </>
  )
}

export const ExperimentsMeasurementForm = memo(ExperimentsMeasurementFormComponent)

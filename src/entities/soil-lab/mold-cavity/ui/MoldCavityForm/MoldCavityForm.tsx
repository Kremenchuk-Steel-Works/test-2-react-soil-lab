import { memo } from 'react'
import { type ArrayPath, type FieldValues } from 'react-hook-form'
import { useMoldCavityFormOptions } from '@/entities/soil-lab/mold-cavity/hooks/useMoldCavityFormOptions'
import type { MoldCavityFormFields } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/schema'
import { MoldCoreForm } from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/MoldCoreForm'
import { moldCoreFormDefaultValues } from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/schema'
import type { MoldCavityDetailResponse } from '@/shared/api/mold-passport/model'
import { useScopedFieldName } from '@/shared/hooks/react-hook-form/useFieldName'
import { createLogger } from '@/shared/lib/logger'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/formKitContext'

const logger = createLogger('MoldCavityForm')

interface FormProps<T extends FieldValues, N extends ArrayPath<T> = ArrayPath<T>> {
  pathPrefix: `${N}.${number}`
  itemData?: MoldCavityDetailResponse
}

export function MoldCavityFormComponent<T extends FieldValues, N extends ArrayPath<T>>({
  pathPrefix,
  itemData,
}: FormProps<T, N>) {
  const Form = useFormKit<T>()
  const fieldName = useScopedFieldName<T, MoldCavityFormFields>(pathPrefix)
  const coresFieldName = fieldName.array('moldCores')

  const options = useMoldCavityFormOptions(itemData)

  logger.debug('[MoldCavityForm] render')

  return (
    <>
      <Form.Controller name={fieldName('castingPatternId')}>
        {({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={options.loadCastingPatterns}
            defaultOptions={options.defaultCastingPatterns}
            isVirtualized
            isClearable
            placeholder="Модель"
          />
        )}
      </Form.Controller>

      <Form.Field name={fieldName('serialNumber')}>
        {({ register }) => <InputField label="Серійний номер" {...register} />}
      </Form.Field>

      <Form.Field name={fieldName('isFunctional')}>
        {({ register }) => <Checkbox label="Придатний для заливання металу" {...register} />}
      </Form.Field>

      {/* Cores */}
      <Form.WithError name={fieldName('moldCores')}>
        <DynamicFieldArray
          title="Стрижень"
          label="стрижень"
          name={coresFieldName}
          form={MoldCoreForm}
          defaultItem={moldCoreFormDefaultValues}
          itemsData={itemData?.moldCores}
        />
      </Form.WithError>
    </>
  )
}

export const MoldCavityForm = memo(MoldCavityFormComponent)

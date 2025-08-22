import { type Path } from 'react-hook-form'
import { useMoldPassportFormOptions } from '@/entities/soil-lab/mold-passport/hooks/useMoldPassportFormOptions'
import { MoldPassportCreateFormKit } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/FormKit'
import type { MoldPassportCreateFormFields } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/schema'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'

const Form = MoldPassportCreateFormKit

export function MoldingAreaDataDynamicForm() {
  const { responseData } = useDynamicMeta<Record<string, never>, MoldPassportDetailResponse>()
  const options = useMoldPassportFormOptions(responseData)

  const fieldName = (field: keyof MoldPassportCreateFormFields) =>
    `${field}` as Path<MoldPassportCreateFormFields>

  return (
    <Form.Controller name={fieldName('castingTechnologyId')}>
      {({ field, fieldState }) => (
        <FormSelectField
          field={field}
          fieldState={fieldState}
          options={options.loadCastingTechnologies}
          defaultOptions={options.defaultCastingTechnologies}
          isVirtualized
          isClearable
          placeholder="Технологія формовки"
        />
      )}
    </Form.Controller>
  )
}

import { useMoldPassportFormOptions } from '@/entities/soil-lab/mold-passport/hooks/useMoldPassportFormOptions'
import type { CastingTechnology } from '@/entities/soil-lab/mold-passport/ui/form/lib/dynamic-fields'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { useFieldName } from '@/shared/hooks/react-hook-form/useFieldName'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/useFormKit'

export function MoldingAreaDataDynamicForm() {
  const Form = useFormKit<CastingTechnology>()
  const { responseData } = useDynamicMeta<Record<string, never>, MoldPassportDetailResponse>()
  const options = useMoldPassportFormOptions(responseData)

  const fieldName = useFieldName<CastingTechnology>()

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

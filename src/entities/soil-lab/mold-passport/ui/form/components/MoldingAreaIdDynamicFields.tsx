import { type FieldValues, type Path } from 'react-hook-form'
import { useMoldPassportFormOptions } from '@/entities/soil-lab/mold-passport/hooks/useMoldPassportFormOptions'
import type { CastingTechnology } from '@/entities/soil-lab/mold-passport/ui/form/lib/dynamic-fields'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/formKitContext'

export function MoldingAreaDataDynamicForm<T extends FieldValues>() {
  const Form = useFormKit<T>()
  const { responseData } = useDynamicMeta<Record<string, never>, MoldPassportDetailResponse>()
  const options = useMoldPassportFormOptions(responseData)

  const fieldName = (field: keyof CastingTechnology) => `${field}` as Path<T>

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

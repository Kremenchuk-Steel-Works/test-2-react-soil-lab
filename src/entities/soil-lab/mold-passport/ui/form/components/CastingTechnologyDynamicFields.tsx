import { useMoldPassportFormOptions } from '@/entities/soil-lab/mold-passport/hooks/useMoldPassportFormOptions'
import type {
  MoldPassportDataAsc,
  MoldPassportDataGsc,
  WithDataAscFormFields,
  WithDataGscFormFields,
} from '@/entities/soil-lab/mold-passport/ui/form/lib/dynamic-fields'
import { moldingSandSystemOptions } from '@/entities/soil-lab/molding-sand-system/model/moldingSandSystem'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { useScopedFieldName } from '@/shared/hooks/react-hook-form/useFieldName'
import { formTransformers } from '@/shared/lib/react-hook-form/nested-error'
import InputField from '@/shared/ui/input-field/InputField'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/formKitContext'

export function CastingTechnologyDataGscDynamicForm() {
  const Form = useFormKit<WithDataGscFormFields>()
  const fieldName = useScopedFieldName<WithDataGscFormFields, MoldPassportDataGsc>('dataGsc')

  return (
    <FieldsetWrapper title={`Пісочно-глиняна формовка`}>
      <Form.Controller name={fieldName('moldingSandSystem')}>
        {({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={moldingSandSystemOptions}
            isVirtualized
            isClearable
            placeholder="Підтип суміші"
          />
        )}
      </Form.Controller>

      <Form.Field name={fieldName('moldingSandNumber')} registerOptions={formTransformers.string}>
        {({ register }) => <InputField label="Номер суміші" {...register} />}
      </Form.Field>

      <Form.Field
        name={fieldName('moldHorizontalDensity')}
        registerOptions={formTransformers.number}
      >
        {({ register }) => <InputField label="Горизонтальна щільність форми" {...register} />}
      </Form.Field>

      <Form.Field name={fieldName('moldVerticalDensity')} registerOptions={formTransformers.number}>
        {({ register }) => <InputField label="Вертикальна щільність форми" {...register} />}
      </Form.Field>
    </FieldsetWrapper>
  )
}

export function CastingTechnologyPassportDataAscDynamicForm() {
  const Form = useFormKit<WithDataAscFormFields>()
  const { responseData } = useDynamicMeta<Record<string, never>, MoldPassportDetailResponse>()
  const options = useMoldPassportFormOptions(responseData)

  const fieldName = useScopedFieldName<WithDataAscFormFields, MoldPassportDataAsc>('dataAsc')

  return (
    <FieldsetWrapper title={`Холодно-твердіюча формовка`}>
      <Form.Field name={fieldName('moldHardness')} registerOptions={formTransformers.number}>
        {({ register }) => <InputField label="Твердість форми" {...register} />}
      </Form.Field>

      <Form.Controller name={fieldName('resinId')}>
        {({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={options.loadResins}
            defaultOptions={options.defaultResins}
            isVirtualized
            isClearable
            placeholder="Смола"
          />
        )}
      </Form.Controller>
    </FieldsetWrapper>
  )
}

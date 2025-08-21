import { type Path } from 'react-hook-form'
import type {
  MoldPassportDataAsc,
  MoldPassportDataGsc,
} from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import { MoldPassportFormKit } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/FormKit'
import type { MoldPassportFormFields } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/schema'
import { moldingSandSystemOptions } from '@/entities/soil-lab/molding-sand-system/model/moldingSandSystem'
import { resinService } from '@/entities/soil-lab/resin'
import type {
  MoldPassportDetailResponse,
  ResinLookupResponse,
  ResinLookupsListResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptions } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { formTransformers } from '@/shared/lib/react-hook-form/nested-error'
import InputField from '@/shared/ui/input-field/InputField'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'

const Form = MoldPassportFormKit

export function CastingTechnologyDataGscDynamicForm() {
  const fieldName = (field: keyof MoldPassportDataGsc) =>
    `dataGsc.${field}` as Path<MoldPassportFormFields>

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
  const { responseData } = useDynamicMeta<Record<string, never>, MoldPassportDetailResponse>()
  const loadResinsOptions = useAsyncOptions<ResinLookupResponse, string>(resinService.getLookup, {
    paramsBuilder: (search, page) => ({
      search,
      page,
      pageSize: 20,
    }),
    responseAdapter: (data: ResinLookupsListResponse) => ({
      items: data.data,
      hasMore: data.data.length < data.totalItems,
    }),
    mapper: (item) => ({
      value: item.id,
      label: item.name,
    }),
  })

  const defaultResinsOptions = useDefaultOption(responseData?.dataAsc?.resin, (data) => ({
    value: data.id,
    label: data.name,
  }))

  const fieldName = (field: keyof MoldPassportDataAsc) =>
    `dataAsc.${field}` as Path<MoldPassportFormFields>

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
            options={loadResinsOptions}
            defaultOptions={defaultResinsOptions}
            isVirtualized
            isClearable
            placeholder="Смола"
          />
        )}
      </Form.Controller>
    </FieldsetWrapper>
  )
}

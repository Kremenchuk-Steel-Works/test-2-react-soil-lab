import { Controller, useFormContext, type Path } from 'react-hook-form'
import type {
  MoldPassportDataAsc,
  MoldPassportDataGsc,
} from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import type { MoldPassportFormFields } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/schema'
import { moldingSandSystemOptions } from '@/entities/molding-shop/molding-sand-system/model/moldingSandSystem'
import { resinService } from '@/entities/molding-shop/resin'
import type {
  MoldPassportDetailResponse,
  ResinLookupResponse,
  ResinLookupsListResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import type { BaseDynamicComponentProps } from '@/shared/lib/zod/dynamic-schemaOld'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

export function CastingTechnologyDataGscDynamicForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<MoldPassportFormFields>()
  const fieldName = (field: keyof MoldPassportDataGsc) =>
    `dataGsc.${field}` as Path<MoldPassportFormFields>

  return (
    <FieldsetWrapper title={`Пісочно-глиняна формовка`}>
      <Controller
        name={fieldName('moldingSandSystem')}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={moldingSandSystemOptions}
            isVirtualized
            isClearable
            placeholder="Підтип суміші"
            errorMessage={getNestedErrorMessage(errors, fieldName('moldingSandSystem'))}
          />
        )}
      />

      <InputFieldWithError
        label="Номер суміші"
        {...control.register(fieldName('moldingSandNumber'), { ...formTransformers.string })}
        errorMessage={getNestedErrorMessage(errors, fieldName('moldingSandNumber'))}
      />

      <InputFieldWithError
        label="Горизонтальна щільність форми"
        {...control.register(fieldName('moldHorizontalDensity'), { ...formTransformers.number })}
        errorMessage={getNestedErrorMessage(errors, fieldName('moldHorizontalDensity'))}
      />

      <InputFieldWithError
        label="Вертикальна щільність форми"
        {...control.register(fieldName('moldVerticalDensity'), { ...formTransformers.number })}
        errorMessage={getNestedErrorMessage(errors, fieldName('moldVerticalDensity'))}
      />
    </FieldsetWrapper>
  )
}

type CastingTechnologyPassportDataAscDynamicFormProps = BaseDynamicComponentProps & {
  responseData?: MoldPassportDetailResponse
}

export function CastingTechnologyPassportDataAscDynamicForm({
  responseData,
}: CastingTechnologyPassportDataAscDynamicFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<MoldPassportFormFields>()
  const loadResinsOptions = useAsyncOptionsNew<ResinLookupResponse, string>(
    resinService.getLookup,
    {
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
    },
  )

  const defaultResinsOptions = useDefaultOption(responseData?.dataAsc?.resin, (data) => ({
    value: data.id,
    label: data.name,
  }))

  const fieldName = (field: keyof MoldPassportDataAsc) =>
    `dataAsc.${field}` as Path<MoldPassportFormFields>

  return (
    <FieldsetWrapper title={`Холодно-твердіюча формовка`}>
      <InputFieldWithError
        label="Твердість форми"
        {...control.register(fieldName('moldHardness'), { ...formTransformers.number })}
        errorMessage={getNestedErrorMessage(errors, fieldName('moldHardness'))}
      />

      <Controller
        name={fieldName('resinId')}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={loadResinsOptions}
            defaultOptions={defaultResinsOptions}
            isVirtualized
            isClearable
            placeholder="Смола"
            errorMessage={getNestedErrorMessage(errors, fieldName('resinId'))}
          />
        )}
      />
    </FieldsetWrapper>
  )
}

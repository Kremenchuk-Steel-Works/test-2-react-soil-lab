import { Controller, useFormContext, type Path } from 'react-hook-form'
import { castingTechnologyService } from '@/entities/molding-shop/casting-technology/api/service'
import type { MoldPassportFormFields } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/schema'
import type {
  CastingTechnologyLookupResponse,
  CastingTechnologyLookupsListResponse,
  MoldPassportDetailResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptions } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import type { BaseDynamicComponentProps } from '@/shared/lib/zod/dynamic-schemaOld'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'

type MoldingAreaDataDynamicFormProps = BaseDynamicComponentProps & {
  responseData?: MoldPassportDetailResponse
}

export function MoldingAreaDataDynamicForm({ responseData }: MoldingAreaDataDynamicFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<MoldPassportFormFields>()
  const loadCastingTechnologiesOptions = useAsyncOptions<CastingTechnologyLookupResponse, number>(
    castingTechnologyService.getLookup,
    {
      paramsBuilder: (search, page) => ({
        search,
        page,
        pageSize: 20,
        // moldingAreaId: moldingAreaId,
      }),
      responseAdapter: (data: CastingTechnologyLookupsListResponse) => ({
        items: data.data,
        hasMore: data.data.length < data.totalItems,
      }),
      mapper: (item) => ({
        value: item.id,
        label: item.name,
      }),
    },
  )

  const defaultCastingTechnologiesOptions = useDefaultOption(
    responseData?.castingTechnology,
    (data) => ({
      value: data.id,
      label: data.name,
    }),
  )

  const fieldName = (field: keyof MoldPassportFormFields) =>
    `${field}` as Path<MoldPassportFormFields>

  return (
    <Controller
      name={fieldName('castingTechnologyId')}
      control={control}
      render={({ field, fieldState }) => (
        <FormSelectField
          field={field}
          fieldState={fieldState}
          options={loadCastingTechnologiesOptions}
          defaultOptions={defaultCastingTechnologiesOptions}
          isVirtualized
          isClearable
          placeholder="Технологія формовки"
          errorMessage={getNestedErrorMessage(errors, fieldName('castingTechnologyId'))}
        />
      )}
    />
  )
}

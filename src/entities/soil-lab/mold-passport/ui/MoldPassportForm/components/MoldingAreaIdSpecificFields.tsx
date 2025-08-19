import { type Path } from 'react-hook-form'
import { castingTechnologyService } from '@/entities/soil-lab/casting-technology/api/service'
import { MoldPassportFormKit } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/FormKit'
import type { MoldPassportFormFields } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/schema'
import type {
  CastingTechnologyLookupResponse,
  CastingTechnologyLookupsListResponse,
  MoldPassportDetailResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { useDynamicMeta } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'

const Form = MoldPassportFormKit

export function MoldingAreaDataDynamicForm() {
  const { responseData } = useDynamicMeta<Record<string, never>, MoldPassportDetailResponse>()
  const loadCastingTechnologiesOptions = useAsyncOptionsNew<
    CastingTechnologyLookupResponse,
    number
  >(castingTechnologyService.getLookup, {
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
  })

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
    <Form.Controller name={fieldName('castingTechnologyId')}>
      {({ field, fieldState }) => (
        <FormSelectField
          field={field}
          fieldState={fieldState}
          options={loadCastingTechnologiesOptions}
          defaultOptions={defaultCastingTechnologiesOptions}
          isVirtualized
          isClearable
          placeholder="Технологія формовки"
        />
      )}
    </Form.Controller>
  )
}

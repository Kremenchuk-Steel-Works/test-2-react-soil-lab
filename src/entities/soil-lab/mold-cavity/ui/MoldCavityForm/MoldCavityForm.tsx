import { memo, useCallback, useMemo } from 'react'
import { type Path } from 'react-hook-form'
import { castingPatternService } from '@/entities/soil-lab/casting-pattern/api/service'
import type { MoldCavityFormFields } from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/schema'
import {
  MoldCoreForm,
  type MoldCoreItemData,
} from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/MoldCoreForm'
import { moldCoreFormDefaultValues } from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/schema'
import type { MoldPassportFormFields } from '@/entities/soil-lab/mold-passport'
import { MoldPassportFormKit } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/FormKit'
import type {
  CastingPatternLookupResponse,
  CastingPatternLookupsListResponse,
  MoldPassportDetailResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptionsNew } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { createLogger } from '@/shared/lib/logger'
import { formTransformers } from '@/shared/lib/react-hook-form/nested-error'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'

const logger = createLogger('MoldCavityForm')

export type MoldCavityPathPrefix = `moldCavities.${number}`
export type MoldCavityItemData = MoldPassportDetailResponse['moldCavities'][number]

interface FormProps {
  pathPrefix: MoldCavityPathPrefix
  itemData?: MoldCavityItemData
}

const Form = MoldPassportFormKit

export function MoldCavityFormComponent({ pathPrefix, itemData }: FormProps) {
  const fieldName = useCallback(
    (field: keyof MoldCavityFormFields) => `${pathPrefix}.${field}` as Path<MoldPassportFormFields>,
    [pathPrefix],
  )

  // Options
  const loadCastingPatternsOptions = useAsyncOptionsNew<CastingPatternLookupResponse, string>(
    castingPatternService.getLookup,
    {
      paramsBuilder: (search, page) => ({
        search,
        page,
        pageSize: 20,
      }),
      responseAdapter: (data: CastingPatternLookupsListResponse) => ({
        items: data.data,
        hasMore: data.data.length < data.totalItems,
      }),
      mapper: (item) => ({
        value: item.id,
        label: item.serialNumber,
      }),
    },
  )

  const defaultCastingPatternsOptions = useDefaultOption(itemData?.castingPattern, (d) => ({
    value: d.id,
    label: d.serialNumber,
  }))

  // Формируем полный путь до вложенного массива
  const coresFieldName = useMemo(() => `${pathPrefix}.moldCores` as const, [pathPrefix])

  logger.debug('[MoldCavityForm] render')

  return (
    <>
      <Form.Controller name={fieldName('castingPatternId')}>
        {({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={loadCastingPatternsOptions}
            defaultOptions={defaultCastingPatternsOptions}
            isVirtualized
            isClearable
            placeholder="Модель"
          />
        )}
      </Form.Controller>

      <Form.Field name={fieldName('serialNumber')} registerOptions={formTransformers.string}>
        {({ register }) => <InputField label="Серійний номер" {...register} />}
      </Form.Field>

      <Form.Field name={fieldName('isFunctional')}>
        {({ register }) => <Checkbox label="Придатний для заливання металу" {...register} />}
      </Form.Field>

      {/* Cores */}
      <Form.WithError name={fieldName('moldCores')}>
        <DynamicFieldArray<MoldPassportFormFields, typeof coresFieldName, MoldCoreItemData>
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

import { memo, useCallback, useMemo } from 'react'
import { type Path } from 'react-hook-form'
import { useMoldCavityFormOptions } from '@/entities/soil-lab/mold-cavity/hooks/useMoldCavityFormOptions'
import type {
  MoldCavityFormFields,
  WithMoldCavitiesFormFields,
} from '@/entities/soil-lab/mold-cavity/ui/MoldCavityForm/schema'
import { MoldCoreForm } from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/MoldCoreForm'
import { moldCoreFormDefaultValues } from '@/entities/soil-lab/mold-core/ui/MoldCoreForm/schema'
import type {
  MoldCavityDetailResponse,
  MoldCoreDetailResponse,
} from '@/shared/api/mold-passport/model'
import { createLogger } from '@/shared/lib/logger'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import InputField from '@/shared/ui/input-field/InputField'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/formKitContext'

const logger = createLogger('MoldCavityForm')

export type MoldCavityPathPrefix = `moldCavities.${number}`
interface FormProps {
  pathPrefix: MoldCavityPathPrefix
  itemData?: MoldCavityDetailResponse
}

export function MoldCavityFormComponent({ pathPrefix, itemData }: FormProps) {
  const Form = useFormKit()
  const fieldName = useCallback(
    (field: keyof MoldCavityFormFields) =>
      `${pathPrefix}.${field}` as Path<WithMoldCavitiesFormFields>,
    [pathPrefix],
  )

  // Options
  const options = useMoldCavityFormOptions(itemData)

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
        <DynamicFieldArray<
          WithMoldCavitiesFormFields,
          typeof coresFieldName,
          MoldCoreDetailResponse
        >
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

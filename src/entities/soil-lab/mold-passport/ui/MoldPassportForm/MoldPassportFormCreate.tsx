import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { moldPassportDynamicSections } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import { MoldPassportCreateFormBase } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/MoldPassportForm'
import {
  moldPassportCreateFormSchema,
  type MoldPassportCreateFormFields,
} from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/schema'
import { moldingAreaService } from '@/entities/soil-lab/molding-area'
import { moldingFlaskService } from '@/entities/soil-lab/molding-flask/api/service'
import { patternPlateFrameService } from '@/entities/soil-lab/pattern-plate-frame/api/service'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { useAsyncOptions } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'
import { createLogger } from '@/shared/lib/logger'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('MoldPassportForm')

type FormFields = MoldPassportCreateFormFields
const schema = moldPassportCreateFormSchema

type MoldPassportFormProps = FormProps<FormFields, MoldPassportDetailResponse>

export function MoldPassportForm({
  defaultValues,
  responseData,
  onSubmit,
  submitBtnName,
}: MoldPassportFormProps) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  })
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = form

  // Options
  const loadMoldingAreasOptions = useAsyncOptions(moldingAreaService.getLookup, {
    paramsBuilder: (search, page) => ({
      search,
      page,
      pageSize: 20,
    }),
    responseAdapter: (data) => ({
      items: data.data,
      hasMore: data.data.length < data.totalItems,
    }),
    mapper: (item) => ({
      value: item.id,
      label: item.name,
    }),
  })

  const defaultMoldingAreasOptions = useDefaultOption(responseData?.moldingArea, (data) => ({
    value: data.id,
    label: data.name,
  }))

  const loadPatternPlateFramesOptions = useAsyncOptions(patternPlateFrameService.getLookup, {
    paramsBuilder: (search, page) => ({
      search,
      page,
      pageSize: 20,
    }),
    responseAdapter: (data) => ({
      items: data.data,
      hasMore: data.data.length < data.totalItems,
    }),
    mapper: (item) => ({
      value: item.id,
      label: item.serialNumber,
    }),
  })

  const defaultPatternPlateFramesOptions = useDefaultOption(
    responseData?.patternPlateFrame,
    (data) => ({
      value: data.id,
      label: data.serialNumber,
    }),
  )

  const loadMoldingFlasksOptions = useAsyncOptions(moldingFlaskService.getLookup, {
    paramsBuilder: (search, page) => ({
      search,
      page,
      pageSize: 20,
    }),
    responseAdapter: (data) => ({
      items: data.data,
      hasMore: data.data.length < data.totalItems,
    }),
    mapper: (item) => ({
      value: item.id,
      label: item.serialNumber,
    }),
  })

  const defaultMoldingFlasksOptions = useDefaultOption(responseData?.moldingFlask, (data) => ({
    value: data.id,
    label: data.serialNumber,
  }))

  // Submit
  const submitHandler: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await onSubmit(data)
      logger.debug('Форма успешно выполнена', response)
    } catch (err) {
      const error = err as Error
      setError('root', { message: error.message })
      logger.error('Ошибка при отправке формы:', 'err:', err, 'data:', data)
    }
  }

  logger.debug('[MoldPassportForm] render', defaultValues)

  return (
    <FormProvider {...form}>
      <FormLayout onSubmit={handleSubmit(submitHandler)}>
        <DynamicFieldsProvider sections={moldPassportDynamicSections} responseData={responseData}>
          <MoldPassportCreateFormBase
            loadMoldingAreasOptions={loadMoldingAreasOptions}
            defaultMoldingAreasOptions={defaultMoldingAreasOptions}
            loadPatternPlateFramesOptions={loadPatternPlateFramesOptions}
            defaultPatternPlateFramesOptions={defaultPatternPlateFramesOptions}
            loadMoldingFlasksOptions={loadMoldingFlasksOptions}
            defaultMoldingFlasksOptions={defaultMoldingFlasksOptions}
            isSubmitting={isSubmitting}
            submitBtnName={submitBtnName}
          />
        </DynamicFieldsProvider>
      </FormLayout>
    </FormProvider>
  )
}

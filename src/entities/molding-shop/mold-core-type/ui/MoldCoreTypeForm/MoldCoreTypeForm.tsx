import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { genderOptions } from '@/entities/admin/people/types/gender'
import {
  moldCoreTypeFormSchema,
  type MoldCoreTypeFormFields,
} from '@/entities/molding-shop/mold-core-type/ui/MoldCoreTypeForm/schema'
import { logger } from '@/shared/lib/logger'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
import type { FormInitialData, FormProps } from '@/types/react-hook-form'

type FormFields = MoldCoreTypeFormFields
const schema = moldCoreTypeFormSchema

export type MoldCoreTypeFormOptions = {}
type FormOptions = MoldCoreTypeFormOptions

export type MoldCoreTypeFormInitialData = FormInitialData<FormFields, FormOptions>

export default function MoldCoreTypeForm({
  initialData,
  onSubmit,
  submitBtnName,
}: FormProps<FormFields, FormOptions>) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: initialData?.defaultValues,
  })

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form

  const submitHandler: SubmitHandler<FormFields> = async (data) => {
    // Submit
    try {
      const response = await onSubmit(data)
      logger.debug('Форма успешно выполнена', response)
    } catch (err) {
      const error = err as Error
      setError('root', { message: error.message })
      logger.error('Ошибка при отправке формы:', err, data)
    }
  }

  return (
    <FormLayout onSubmit={handleSubmit(submitHandler)}>
      <h4 className="layout-text">Тип стрижня</h4>

      <Controller
        name="castingPatternId"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={genderOptions}
            isVirtualized
            isClearable
            placeholder="Модель"
            errorMessage={getNestedErrorMessage(errors, 'castingPatternId')}
          />
        )}
      />

      <InputFieldWithError
        label="Номер моделі"
        {...register('modelNumber', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'modelNumber')}
      />

      <InputFieldWithError
        label="Номер інвентарного ящику"
        {...register('inventoryBoxNumber', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'inventoryBoxNumber')}
      />

      <InputFieldWithError
        label="Термін придатності, днів"
        {...register('shelfLifeDays', formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'shelfLifeDays')}
      />

      <ButtonWithError
        className="w-full"
        type="submit"
        errorMessage={errors.root?.message}
        disabled={isSubmitting}
      >
        {submitBtnName}
      </ButtonWithError>
    </FormLayout>
  )
}

// import { zodResolver } from '@hookform/resolvers/zod'
// import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
// import { moldingAreaAdditionalOptions } from '@/entities/molding-shop/molding-area/model/additionalOptions'
// import {
//   moldingAreaFormSchema,
//   type MoldingAreaFormFields,
// } from '@/entities/molding-shop/molding-area/ui/MoldingAreaForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import {
//   ButtonWithError,
//   InputFieldWithError,
//   TextAreaFieldWithError,
// } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = MoldingAreaFormFields
// const schema = moldingAreaFormSchema

// export type MoldingAreaFormOptions = {}
// type FormOptions = MoldingAreaFormOptions

// export type MoldingAreaFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function MoldingAreaForm({
//   initialData,
//   onSubmit,
//   submitBtnName,
// }: FormProps<FormFields, FormOptions>) {
//   const form = useForm<FormFields>({
//     resolver: zodResolver(schema),
//     defaultValues: initialData?.defaultValues,
//   })

//   const {
//     control,
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = form

//   const submitHandler: SubmitHandler<FormFields> = async (data) => {
//     // Submit
//     try {
//       const response = await onSubmit(data)
//       logger.debug('Форма успешно выполнена', response)
//     } catch (err) {
//       const error = err as Error
//       setError('root', { message: error.message })
//       logger.error('Ошибка при отправке формы:', err, data)
//     }
//   }

//   return (
//     <FormLayout onSubmit={handleSubmit(submitHandler)}>
//       <h4 className="layout-text">Ділянка формовки</h4>

//       <InputFieldWithError
//         label="Назва"
//         {...register('name', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'name')}
//       />

//       <TextAreaFieldWithError
//         label="Опис"
//         {...register('description', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'description')}
//       />

//       <InputFieldWithError
//         label="Одиниці тиску"
//         {...register('name', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'name')}
//       />

//       <Controller
//         name="additionalOptions"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={moldingAreaAdditionalOptions}
//             isMulti
//             isVirtualized
//             isClearable
//             placeholder="Додаткові опції"
//             errorMessage={getNestedErrorMessage(errors, 'additionalOptions')}
//           />
//         )}
//       />

//       <ButtonWithError
//         className="w-full"
//         type="submit"
//         errorMessage={errors.root?.message}
//         disabled={isSubmitting}
//       >
//         {submitBtnName}
//       </ButtonWithError>
//     </FormLayout>
//   )
// }

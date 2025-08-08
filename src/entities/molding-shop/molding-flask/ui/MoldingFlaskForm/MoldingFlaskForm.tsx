// import { zodResolver } from '@hookform/resolvers/zod'
// import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
// import { moldingFlaskStatusOptions } from '@/entities/molding-shop/molding-flask/model/status'
// import {
//   moldingFlaskFormSchema,
//   type MoldingFlaskFormFields,
// } from '@/entities/molding-shop/molding-flask/ui/MoldingFlaskForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = MoldingFlaskFormFields
// const schema = moldingFlaskFormSchema

// export type MoldingFlaskFormOptions = {}
// type FormOptions = MoldingFlaskFormOptions

// export type MoldingFlaskFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function MoldingFlaskForm({
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
//       <h4 className="layout-text">Опока</h4>

//       <InputFieldWithError
//         label="Номер креслення"
//         {...register('blueprintNumber', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'blueprintNumber')}
//       />

//       <InputFieldWithError
//         label="Серійний номер"
//         {...register('serialNumber', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'serialNumber')}
//       />

//       <Controller
//         name="status"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={moldingFlaskStatusOptions}
//             isMulti
//             isVirtualized
//             isClearable
//             placeholder="Статус"
//             errorMessage={getNestedErrorMessage(errors, 'status')}
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

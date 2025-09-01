// import { zodResolver } from '@hookform/resolvers/zod'
// import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
// import { resinComponentOptions } from '@/entities/molding-shop/resin/model/component'
// import { resinTypeOptions } from '@/entities/molding-shop/resin/model/type'
// import {
//   resinFormSchema,
//   type ResinFormFields,
// } from '@/entities/molding-shop/resin/ui/MoldingFlaskForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = ResinFormFields
// const schema = resinFormSchema

// export type ResinFormOptions = {}
// type FormOptions = ResinFormOptions

// export type ResinFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function ResinForm({
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
//     <FormLayout onSubmit={(e) => void handleSubmit(submitHandler)(e)}>
//       <h5 className="layout-text">Смола</h5>

//       <Controller
//         name="type"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={resinTypeOptions}
//             isMulti
//             isVirtualized
//             isClearable
//             placeholder="Тип"
//             errorMessage={getNestedErrorMessage(errors, 'type')}
//           />
//         )}
//       />

//       <InputFieldWithError
//         label="Торгова марка"
//         {...register('brand', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'brand')}
//       />

//       <InputFieldWithError
//         label="Назва"
//         {...register('name', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'name')}
//       />

//       <Controller
//         name="component"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={resinComponentOptions}
//             isMulti
//             isVirtualized
//             isClearable
//             placeholder="Компонент"
//             errorMessage={getNestedErrorMessage(errors, 'component')}
//           />
//         )}
//       />

//       <InputFieldWithError
//         label="Серійний номер"
//         {...register('serialNumber', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'serialNumber')}
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

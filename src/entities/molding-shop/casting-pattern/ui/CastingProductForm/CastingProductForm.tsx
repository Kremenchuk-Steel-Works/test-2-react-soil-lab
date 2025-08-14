// import { zodResolver } from '@hookform/resolvers/zod'
// import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
// import { genderOptions } from '@/entities/admin/people/types/gender'
// import { castingPatternStatusOptions } from '@/entities/molding-shop/casting-pattern/model/status'
// import {
//   castingPatternFormSchema,
//   type CastingPatternFormFields,
// } from '@/entities/molding-shop/casting-pattern/ui/CastingProductForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = CastingPatternFormFields
// const schema = castingPatternFormSchema

// export type CastingPatternFormOptions = {}
// type FormOptions = CastingPatternFormOptions

// export type CastingPatternFormInitialData = FormProps<FormFields, FormOptions>

// export default function CastingPatternForm({
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
//       <h5 className="layout-text">Технологія формовки</h5>

//       <Controller
//         name="castingProductId"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={genderOptions}
//             isVirtualized
//             isClearable
//             placeholder="Тип"
//             errorMessage={getNestedErrorMessage(errors, 'castingProductId')}
//           />
//         )}
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
//             options={castingPatternStatusOptions}
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

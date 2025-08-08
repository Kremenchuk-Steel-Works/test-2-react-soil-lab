// import { zodResolver } from '@hookform/resolvers/zod'
// import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
// import { castingProductTypeOptions } from '@/entities/molding-shop/casting-product/model/type'
// import {
//   castingProductFormSchema,
//   type CastingProductFormFields,
// } from '@/entities/molding-shop/casting-product/ui/CastingProductForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import {
//   ButtonWithError,
//   CheckboxWithError,
//   InputFieldWithError,
// } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = CastingProductFormFields
// const schema = castingProductFormSchema

// export type CastingProductFormOptions = {}
// type FormOptions = CastingProductFormOptions

// export type CastingProductFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function CastingProductForm({
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
//       <h4 className="layout-text">Технологія формовки</h4>

//       <Controller
//         name="type"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={castingProductTypeOptions}
//             isVirtualized
//             isClearable
//             placeholder="Тип"
//             errorMessage={getNestedErrorMessage(errors, 'type')}
//           />
//         )}
//       />

//       <InputFieldWithError
//         label="Назва"
//         {...register('name', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'name')}
//       />

//       <InputFieldWithError
//         label="Номер креслення"
//         {...register('blueprintNumber', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'blueprintNumber')}
//       />

//       <CheckboxWithError
//         label="Тільки ручна формовка"
//         {...register(`isCastingManualOnly`, formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'isCastingManualOnly')}
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

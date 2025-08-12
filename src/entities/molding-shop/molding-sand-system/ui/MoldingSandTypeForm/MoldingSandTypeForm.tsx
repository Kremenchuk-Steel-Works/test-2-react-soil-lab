// import { zodResolver } from '@hookform/resolvers/zod'
// import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
// import { genderOptions } from '@/entities/admin/people/types/gender'
// import {
//   moldingSandTypeFormSchema,
//   type MoldingSandTypeFormFields,
// } from '@/entities/molding-shop/molding-sand-type/ui/MoldingSandTypeForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = MoldingSandTypeFormFields
// const schema = moldingSandTypeFormSchema

// export type MoldingSandTypeFormOptions = {}
// type FormOptions = MoldingSandTypeFormOptions

// export type MoldingSandTypeFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function MoldingSandTypeForm({
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

//       <InputFieldWithError
//         label="Назва"
//         {...register('name', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'name')}
//       />

//       <InputFieldWithError
//         label="Абревіатура"
//         {...register('abbreviation', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'abbreviation')}
//       />

//       <Controller
//         name="castingTechnologyId"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={genderOptions}
//             isVirtualized
//             isClearable
//             placeholder="Технологія формовки"
//             errorMessage={getNestedErrorMessage(errors, 'castingTechnologyId')}
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

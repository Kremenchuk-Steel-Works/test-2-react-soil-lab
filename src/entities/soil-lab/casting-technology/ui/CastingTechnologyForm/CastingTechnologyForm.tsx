// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm, type SubmitHandler } from 'react-hook-form'
// import {
//   castingTechnologyFormSchema,
//   type CastingTechnologyFormFields,
// } from '@/entities/molding-shop/casting-technology/ui/CastingTechnologyForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = CastingTechnologyFormFields
// const schema = castingTechnologyFormSchema

// export type CastingTechnologyFormOptions = {}
// type FormOptions = CastingTechnologyFormOptions

// export type CastingTechnologyFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function CastingTechnologyForm({
//   initialData,
//   onSubmit,
//   submitBtnName,
// }: FormProps<FormFields, FormOptions>) {
//   const form = useForm<FormFields>({
//     resolver: zodResolver(schema),
//     defaultValues: initialData?.defaultValues,
//   })

//   const {
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
//       <h5 className="layout-text">Технологія формовки</h5>

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

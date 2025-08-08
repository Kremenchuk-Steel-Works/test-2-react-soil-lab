// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm, type SubmitHandler } from 'react-hook-form'
// import {
//   coreMakingMachineFormSchema,
//   type CoreMakingMachineFormFields,
// } from '@/entities/molding-shop/core-making-machine/ui/CoreMakingMachineForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = CoreMakingMachineFormFields
// const schema = coreMakingMachineFormSchema

// export type CoreMakingMachineFormOptions = {}
// type FormOptions = CoreMakingMachineFormOptions

// export type CoreMakingMachineFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function CoreMakingMachineForm({
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
//     <FormLayout onSubmit={handleSubmit(submitHandler)}>
//       <h4 className="layout-text">Установка з виготовлення стрижнів</h4>

//       <InputFieldWithError
//         label="Торгова марка"
//         {...register('brand', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'brand')}
//       />

//       <InputFieldWithError
//         label="Модель"
//         {...register('model', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'model')}
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

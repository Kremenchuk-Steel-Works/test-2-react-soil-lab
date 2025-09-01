// import { zodResolver } from '@hookform/resolvers/zod'
// import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
// import { moldExperimentDocumentOptions } from '@/entities/molding-shop/mold-experiment/model/document'
// import {
//   moldExperimentFormSchema,
//   type MoldExperimentFormFields,
// } from '@/entities/molding-shop/mold-experiment/ui/MoldExperimentForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import { ButtonWithError, TextAreaFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = MoldExperimentFormFields
// const schema = moldExperimentFormSchema

// export type MoldExperimentFormOptions = {}
// type FormOptions = MoldExperimentFormOptions

// export type MoldExperimentFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function MoldExperimentForm({
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
//       <h5 className="layout-text">Експеримент</h5>

//       <Controller
//         name="documentId"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={moldExperimentDocumentOptions}
//             isMulti
//             isVirtualized
//             isClearable
//             placeholder="Документ"
//             errorMessage={getNestedErrorMessage(errors, 'documentId')}
//           />
//         )}
//       />

//       <TextAreaFieldWithError
//         label="Опис робіт"
//         {...register('workDescription', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'workDescription')}
//       />

//       <TextAreaFieldWithError
//         label="Нотатки"
//         {...register('notes', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'notes')}
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

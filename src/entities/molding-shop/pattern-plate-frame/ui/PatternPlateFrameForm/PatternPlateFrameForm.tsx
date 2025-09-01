// import { zodResolver } from '@hookform/resolvers/zod'
// import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
// import { patternPlateFrameStatusOptions } from '@/entities/molding-shop/pattern-plate-frame/model/status'
// import {
//   patternPlateFrameFormSchema,
//   type PatternPlateFrameFormFields,
// } from '@/entities/molding-shop/pattern-plate-frame/ui/PatternPlateFrameForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = PatternPlateFrameFormFields
// const schema = patternPlateFrameFormSchema

// export type PatternPlateFrameFormOptions = {}
// type FormOptions = PatternPlateFrameFormOptions

// export type PatternPlateFrameFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function PatternPlateFrameForm({
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
//       <h5 className="layout-text">Модельна рамка</h5>

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
//             options={patternPlateFrameStatusOptions}
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

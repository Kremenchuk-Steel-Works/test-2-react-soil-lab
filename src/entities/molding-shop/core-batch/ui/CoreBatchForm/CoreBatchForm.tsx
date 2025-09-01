// import { zodResolver } from '@hookform/resolvers/zod'
// import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
// import { genderOptions } from '@/entities/admin/people/types/gender'
// import {
//   coreBatchFormSchema,
//   type CoreBatchFormFields,
// } from '@/entities/molding-shop/core-batch/ui/CoreBatchForm/schema'
// import { logger } from '@/shared/lib/logger'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import { ButtonWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
// import type { FormInitialData, FormProps } from '@/types/react-hook-form'

// type FormFields = CoreBatchFormFields
// const schema = coreBatchFormSchema

// export type CoreBatchFormOptions = {}
// type FormOptions = CoreBatchFormOptions

// export type CoreBatchFormInitialData = FormInitialData<FormFields, FormOptions>

// export default function CoreBatchForm({
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
//       <h5 className="layout-text">Партія стрижнів</h5>

//       <Controller
//         name="moldingSandTypeId"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={genderOptions}
//             isVirtualized
//             isClearable
//             placeholder="Тип суміші"
//             errorMessage={getNestedErrorMessage(errors, 'moldingSandTypeId')}
//           />
//         )}
//       />

//       <Controller
//         name="moldCoreTypeId"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={genderOptions}
//             isVirtualized
//             isClearable
//             placeholder="Тип стрижня"
//             errorMessage={getNestedErrorMessage(errors, 'moldCoreTypeId')}
//           />
//         )}
//       />

//       <Controller
//         name="machineId"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={genderOptions}
//             isVirtualized
//             isClearable
//             placeholder="Установка з виготовлення стрижнів"
//             errorMessage={getNestedErrorMessage(errors, 'machineId')}
//           />
//         )}
//       />

//       <Controller
//         name="resinId"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={genderOptions}
//             isVirtualized
//             isClearable
//             placeholder="Смола"
//             errorMessage={getNestedErrorMessage(errors, 'resinId')}
//           />
//         )}
//       />

//       <FieldsetWrapper title={`Дозування компонента`}>
//         <InputFieldWithError
//           label="А"
//           {...register('resinComponentADosage', formTransformers.string)}
//           errorMessage={getNestedErrorMessage(errors, 'resinComponentADosage')}
//         />

//         <InputFieldWithError
//           label="B"
//           {...register('resinComponentBDosage', formTransformers.string)}
//           errorMessage={getNestedErrorMessage(errors, 'resinComponentBDosage')}
//         />
//       </FieldsetWrapper>

//       <Controller
//         name="triethylamineId"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={genderOptions}
//             isVirtualized
//             isClearable
//             placeholder="Триетиламін"
//             errorMessage={getNestedErrorMessage(errors, 'triethylamineId')}
//           />
//         )}
//       />

//       <Controller
//         name="ironOxideId"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormSelectField
//             field={field}
//             fieldState={fieldState}
//             options={genderOptions}
//             isVirtualized
//             isClearable
//             placeholder="Оксид заліза"
//             errorMessage={getNestedErrorMessage(errors, 'ironOxideId')}
//           />
//         )}
//       />

//       <InputFieldWithError
//         label="Температура піску, °C"
//         {...register('sandTemperature', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'sandTemperature')}
//       />

//       <InputFieldWithError
//         label="Твердість контрольного стрижня, од."
//         {...register('controlCoreHardness', formTransformers.string)}
//         errorMessage={getNestedErrorMessage(errors, 'controlCoreHardness')}
//       />

//       <Controller
//         name="manufacturingTimestamp"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormDateTimeField
//             field={field}
//             fieldState={fieldState}
//             type="datetime"
//             label="Дата та час виготовлення"
//             errorMessage={getNestedErrorMessage(errors, 'manufacturingTimestamp')}
//           />
//         )}
//       />

//       <Controller
//         name="batchExpiryDate"
//         control={control}
//         render={({ field, fieldState }) => (
//           <FormDateTimeField
//             field={field}
//             fieldState={fieldState}
//             allowFutureDates
//             type="datetime"
//             label="Термін придатності до"
//             errorMessage={getNestedErrorMessage(errors, 'batchExpiryDate')}
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

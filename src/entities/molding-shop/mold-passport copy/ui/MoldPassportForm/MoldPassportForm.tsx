// import { Controller, type SubmitHandler, type UseFormReturn } from 'react-hook-form'
// import { genderOptions } from '@/entities/admin/people/types/gender'
// import { MoldCavityForm } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/MoldCavityForm'
// import { moldCavityFormDefaultValues } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
// import { moldPassportDynamicFieldConfig } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
// import { type MoldPassportFormFields } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/schema'
// import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
// import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
// import { DynamicFieldArea } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArea'
// import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
// import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
// import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
// import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
// import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
// import {
//   ButtonWithError,
//   CheckboxWithError,
//   InputFieldWithError,
//   TextAreaFieldWithError,
// } from '@/shared/ui/with-error/fieldsWithError'

// type MoldPassportFormOptions = {}

// interface Props {
//   form: UseFormReturn<MoldPassportFormFields>
//   options: MoldPassportFormOptions
//   onSubmit: SubmitHandler<MoldPassportFormFields>
//   submitBtnName?: string
// }

// export default function MoldPassportBaseForm({ form, options, onSubmit, submitBtnName }: Props) {
//   const {
//     control,
//     register,
//     getValues,
//     resetField,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = form

//   return (
//     <DynamicFieldsProvider
//       control={control}
//       getValues={getValues}
//       resetField={resetField}
//       errors={errors}
//       config={moldPassportDynamicFieldConfig}
//       options={options}
//     >
//       <FormLayout onSubmit={handleSubmit(onSubmit)}>
//         <h4 className="layout-text">Паспорт ливарної форми</h4>

//         <AlertMessage type={AlertType.WARNING} message={`Попередній стан форми: Не заповнено`} />

//         <Controller
//           name="moldingAreaId"
//           control={control}
//           render={({ field, fieldState }) => (
//             <FormSelectField
//               field={field}
//               fieldState={fieldState}
//               options={genderOptions}
//               isVirtualized
//               isClearable
//               placeholder="Ділянка формовки"
//               errorMessage={getNestedErrorMessage(errors, 'moldingAreaId')}
//             />
//           )}
//         />

//         {/* DynamicFields */}
//         <DynamicFieldArea triggerFor="moldingAreaId" />

//         <Controller
//           name="patternPlateFrameId"
//           control={control}
//           render={({ field, fieldState }) => (
//             <FormSelectField
//               field={field}
//               fieldState={fieldState}
//               options={organizationsOptions}
//               isVirtualized
//               isClearable
//               placeholder="Модельна рамка"
//               errorMessage={getNestedErrorMessage(errors, 'patternPlateFrameId')}
//             />
//           )}
//         />

//         <Controller
//           name="moldingFlaskId"
//           control={control}
//           render={({ field, fieldState }) => (
//             <FormSelectField
//               field={field}
//               fieldState={fieldState}
//               options={organizationsOptions}
//               isVirtualized
//               isClearable
//               placeholder="Опока"
//               errorMessage={getNestedErrorMessage(errors, 'moldingFlaskId')}
//             />
//           )}
//         />

//         {/* DynamicFields */}
//         <DynamicFieldArea triggerFor="castingTechnologyId" />

//         <Controller
//           name="markingYear"
//           control={control}
//           render={({ field, fieldState }) => (
//             <FormDateTimeField
//               field={field}
//               fieldState={fieldState}
//               type="year"
//               yearOffsetPast={2}
//               yearOffsetFuture={2}
//               label="Рік маркування відбитків"
//               errorMessage={getNestedErrorMessage(errors, 'markingYear')}
//             />
//           )}
//         />

//         {/* Cavities */}
//         <DynamicFieldArray
//           title="Відбиток деталі у формі"
//           label="відбиток деталі у формі"
//           name="moldCavities"
//           form={MoldCavityForm}
//           defaultItem={moldCavityFormDefaultValues}
//           control={control}
//           register={register}
//           errors={errors}
//         />

//         <InputFieldWithError
//           label="Тиск, од."
//           {...register('pressingPressure', formTransformers.string)}
//           errorMessage={getNestedErrorMessage(errors, 'pressingPressure')}
//         />

//         <InputFieldWithError
//           label="Порядковий номер форми за зміну"
//           {...register('moldSequenceInShift', formTransformers.string)}
//           errorMessage={getNestedErrorMessage(errors, 'moldSequenceInShift')}
//         />

//         <Controller
//           name="moldAssemblyTimestamp"
//           control={control}
//           render={({ field, fieldState }) => (
//             <FormDateTimeField
//               field={field}
//               fieldState={fieldState}
//               type="datetime"
//               label="Дата та час складання півформ"
//               errorMessage={getNestedErrorMessage(errors, 'moldAssemblyTimestamp')}
//             />
//           )}
//         />

//         <Controller
//           name="experimentIds"
//           control={control}
//           render={({ field, fieldState }) => (
//             <FormSelectField
//               field={field}
//               fieldState={fieldState}
//               options={organizationsOptions}
//               isMulti
//               isVirtualized
//               isClearable
//               placeholder="Експеримент"
//               errorMessage={getNestedErrorMessage(errors, 'experimentIds')}
//             />
//           )}
//         />

//         <CheckboxWithError
//           label="Форма справна"
//           {...register(`status`, formTransformers.string)}
//           errorMessage={getNestedErrorMessage(errors, 'status')}
//         />

//         <TextAreaFieldWithError
//           label="Нотатка"
//           {...register('notes', formTransformers.string)}
//           errorMessage={getNestedErrorMessage(errors, 'notes')}
//         />

//         <ButtonWithError
//           className="w-full"
//           type="submit"
//           errorMessage={errors.root?.message}
//           disabled={isSubmitting}
//         >
//           {submitBtnName}
//         </ButtonWithError>
//       </FormLayout>
//     </DynamicFieldsProvider>
//   )
// }

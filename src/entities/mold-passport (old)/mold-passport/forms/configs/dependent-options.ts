// import type { DependentOptionsConfig } from '@/shared/hooks/react-hook-form/options/useDependentOptions'
// import type { Option, SelectOptions } from '@/shared/ui/select/ReactSelect'
// import type { MoldPassportFormFieldsOld } from '../schema'

// type FormFields = MoldPassportFormFieldsOld

// export interface ConfigDependencies {
//   organizationsOptions: Option<string>[]
//   positionsOptions: Option<string>[]
//   loadAsyncOrganizationOptions: SelectOptions<Option<string>>
// }

// /**
//  * Функция-фабрика для создания конфигурации зависимых полей.
//  * @param options - Объект с динамическими данными (например, опциями для селектов).
//  * @returns Конфигурационный объект для useDependentOptions.
//  */
// export const moldPassportDependentOptionsConfig = (
//   options: ConfigDependencies,
// ): DependentOptionsConfig<FormFields> => {
//   return {
//     test: {
//       rules: [
//         {
//           conditions: {
//             firstName: 'John',
//             gender: 'female',
//           },
//           exceptions: {
//             lastName: 'Doe',
//           },
//           options: options.organizationsOptions,
//           placeholder: 'Оберіть організацію для John',
//         },
//         {
//           conditions: {
//             gender: 'male',
//           },
//           options: options.loadAsyncOrganizationOptions,
//           placeholder: 'Оберіть організацію для чоловіка',
//         },
//         {
//           conditions: {
//             gender: 'female',
//           },
//           options: options.positionsOptions,
//           placeholder: 'Оберіть посаду для жінки',
//         },
//         {
//           conditions: {
//             gender: ['other', 'unknown'],
//           },
//           options: [],
//           placeholder: 'Недоступно для даної статі',
//         },
//       ],
//       defaultOptions: [],
//       defaultPlaceholder: 'Організація / Посада',
//       resetOnChanges: true,
//       disableWhenUnmet: true,
//     },
//   }
// }

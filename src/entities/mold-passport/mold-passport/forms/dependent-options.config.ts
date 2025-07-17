import type { DependentOptionsConfig } from '@/shared/hooks/useDependentOptions'
import type { Option } from '@/shared/ui/select/ReactSelect'
import type { MoldPassportFormFields } from './schema'

type FormFields = MoldPassportFormFields

export interface ConfigDependencies {
  organizationsOptions: Option<string>[]
  positionsOptions: Option<string>[]
}

/**
 * Функция-фабрика для создания конфигурации зависимых полей.
 * @param dependencies - Объект с динамическими данными (например, опциями для селектов).
 * @returns Конфигурационный объект для useDependentOptions.
 */
export const moldPassportDependentOptionsConfig = (
  dependencies: ConfigDependencies,
): DependentOptionsConfig<FormFields> => {
  const { organizationsOptions, positionsOptions } = dependencies

  return {
    test: {
      rules: [
        {
          conditions: {
            firstName: 'John',
            gender: 'male',
          },
          exceptions: {
            lastName: 'Doe',
          },
          options: organizationsOptions,
          placeholder: 'Оберіть організацію для John',
        },
        {
          conditions: {
            gender: 'female',
          },
          options: positionsOptions,
          placeholder: 'Оберіть посаду для жінки',
        },
        {
          conditions: {
            gender: ['other', 'unknown'],
          },
          options: [],
          placeholder: 'Недоступно для даної статі',
        },
      ],
      defaultOptions: [],
      defaultPlaceholder: 'Спочатку оберіть стать',
      resetOnChanges: true,
      disableWhenUnmet: true,
    },
  }
}

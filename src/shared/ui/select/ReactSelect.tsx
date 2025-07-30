import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type FocusEvent,
  type JSX,
} from 'react'
import Select, {
  type ActionMeta,
  type ControlProps,
  type CSSObjectWithLabel,
  type GroupBase,
  type InputActionMeta,
  type MenuProps,
  type OnChangeValue,
  type OptionProps,
  type Props as SelectProps,
  type StylesConfig,
  type ValueContainerProps,
} from 'react-select'
import { AsyncPaginate, withAsyncPaginate, type LoadOptions } from 'react-select-async-paginate'
import CreatableSelect from 'react-select/creatable'
import { twMerge } from 'tailwind-merge'
import { logger } from '@/shared/lib/logger'
import AnimatedMenu from '@/shared/ui/select/AnimatedMenu'
import { FloatingLabelControl } from '@/shared/ui/select/FloatingLabelControl'
import {
  baseClassNames,
  customComponents,
  type ClassNamesConfig,
} from '@/shared/ui/select/ReactSelect.styles'
import { VirtualizedMenuList } from '@/shared/ui/select/VirtualizedMenuList'

const CreatableAsyncPaginate = withAsyncPaginate(CreatableSelect)

export type Option<ValueType = string | number | boolean> = {
  value: ValueType
  label: string
}

// Тип для асинхронной функции загрузки
export type AsyncOptionsLoader<OptionType extends Option> = (
  search: string,
  page: number,
) => Promise<{
  options: OptionType[]
  hasMore: boolean
}>

export type SelectOptions<OptionType extends Option> = OptionType[] | AsyncOptionsLoader<OptionType>

export interface ReactSelectProps<
  OptionType extends Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> extends Omit<SelectProps<OptionType, IsMulti, Group>, 'options' | 'onChange'> {
  onChange?: (
    newValue: OnChangeValue<OptionType, IsMulti>,
    actionMeta: ActionMeta<OptionType>,
  ) => void
  options?: OptionType[] | AsyncOptionsLoader<OptionType>
  customClassNames?: ClassNamesConfig
  customStyles?: StylesConfig<OptionType, IsMulti, Group>
  isCreatable?: boolean
  isVirtualized?: boolean
  debounceTimeout?: number
}

function ReactSelect<
  OptionType extends Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>({
  customClassNames = {},
  customStyles = {},
  isCreatable = false,
  isClearable = true,
  isVirtualized = true,
  options,
  debounceTimeout = 350,
  ...props
}: ReactSelectProps<OptionType, IsMulti, Group>): JSX.Element {
  const isAsync = typeof options === 'function'

  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!isAsync) {
      setIsTyping(false)
      return
    }
    if (!inputValue) {
      setIsTyping(false)
      return
    }
    setIsTyping(true)
    const typingTimer = setTimeout(() => {
      setIsTyping(false)
    }, debounceTimeout)
    return () => clearTimeout(typingTimer)
  }, [inputValue, debounceTimeout, isAsync])

  const loadOptionsAdapter: LoadOptions<OptionType, Group, { page: number }> = useCallback(
    async (search, _loadedOptions, additional) => {
      if (typeof options !== 'function') {
        logger.error('`loadOptions` prop is required when `isAsyncPaginate` is true.')
        return { options: [], hasMore: false }
      }
      setIsLoading(true)
      try {
        const page = additional?.page || 1
        const result = await options(search, page)
        return {
          options: result.options,
          hasMore: result.hasMore,
          additional: { page: page + 1 },
        }
      } finally {
        setIsLoading(false)
      }
    },
    [options],
  )

  const handleInputChange = (value: string, actionMeta: InputActionMeta) => {
    if (actionMeta.action === 'input-change') {
      setInputValue(value)
    }
    props.onInputChange?.(value, actionMeta)
  }

  const handleChange = (
    newValue: OnChangeValue<OptionType, IsMulti>,
    actionMeta: ActionMeta<OptionType>,
  ) => {
    // Вызываем оригинальный onChange, если он передан
    props.onChange?.(newValue, actionMeta)

    // Очищаем поле ввода после выбора или создания опции
    if (actionMeta.action === 'select-option' || actionMeta.action === 'create-option') {
      setInputValue('')
    }
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    props.onBlur?.(event)

    if (props.isMulti) {
      setInputValue('')
      return
    }

    const selectedOption = props.value as OptionType | null
    if (inputValue && inputValue !== (selectedOption?.label || '')) {
      setInputValue('')
    }
  }

  const SelectComponent = useMemo(() => {
    if (isAsync) {
      return isCreatable ? CreatableAsyncPaginate : AsyncPaginate
    }
    return isCreatable ? CreatableSelect : Select
  }, [isCreatable, isAsync]) as ElementType

  const finalProps = {
    ...props,
    isClearable,
    unstyled: true,
    noOptionsMessage: ({ inputValue }: { inputValue: string }) => {
      if (isTyping) return '' // Search
      if (inputValue) return 'Нічого не знайдено' // No results
      return 'Опції відсутні' // No options
    },
    formatCreateLabel: (inputValue: string) => `Додати: "${inputValue}"`,
    styles: {
      ...customStyles,
      menu: (base: CSSObjectWithLabel, props: MenuProps<OptionType, IsMulti, Group>) => ({
        ...base,
        // Меню должно быть поверх других элементов
        zIndex: 50,
        ...(customStyles.menu ? customStyles.menu(base, props) : {}),
      }),
      control: (base: CSSObjectWithLabel, state: ControlProps<OptionType, IsMulti, Group>) => {
        const custom = customStyles.control ? customStyles.control(base, state) : {}
        return { ...base, ...custom, minHeight: '54px' }
      },
      valueContainer: (
        base: CSSObjectWithLabel,
        state: ValueContainerProps<OptionType, IsMulti, Group>,
      ) => {
        const custom = customStyles.valueContainer ? customStyles.valueContainer(base, state) : {}
        return { ...base, ...custom, height: '100%' }
      },
    },
    components: {
      ...customComponents,
      ...props.components,
      Control: FloatingLabelControl,
      Menu: AnimatedMenu,
      ...(isVirtualized && { MenuList: VirtualizedMenuList }),
      Placeholder: () => null,
    },
    classNames: {
      control: (state: { isFocused: boolean; isDisabled: boolean }) =>
        twMerge(baseClassNames.control?.(state), customClassNames.control?.(state)),
      input: () => twMerge(baseClassNames.input?.(), customClassNames.input?.()),
      placeholder: () => twMerge(baseClassNames.placeholder?.(), customClassNames.placeholder?.()),
      option: (state: OptionProps<OptionType, IsMulti, Group>) =>
        twMerge(baseClassNames.option?.(state), customClassNames.option?.(state)),
      menu: () => twMerge(baseClassNames.menu?.(), customClassNames.menu?.()),
      valueContainer: (state: ValueContainerProps<OptionType, IsMulti, Group>) =>
        twMerge(baseClassNames.valueContainer?.(state), customClassNames.valueContainer?.(state)),
      singleValue: () => twMerge(baseClassNames.singleValue?.(), customClassNames.singleValue?.()),
      multiValue: () => twMerge(baseClassNames.multiValue?.(), customClassNames.multiValue?.()),
      multiValueLabel: () =>
        twMerge(baseClassNames.multiValueLabel?.(), customClassNames.multiValueLabel?.()),
      multiValueRemove: () =>
        twMerge(baseClassNames.multiValueRemove?.(), customClassNames.multiValueRemove?.()),
    },
    onChange: handleChange,
    onInputChange: handleInputChange,
    onBlur: handleBlur,
    inputValue,

    ...(isAsync
      ? {
          // Пропсы для асинхронного режима
          loadOptions: loadOptionsAdapter,
          debounceTimeout,
          additional: { page: 1 },
          loadingMessage: () => 'Завантаження...',
          isLoading,
        }
      : {
          // Пропсы для обычного режима
          options: options,
        }),
  }

  return <SelectComponent {...finalProps} />
}

export default ReactSelect

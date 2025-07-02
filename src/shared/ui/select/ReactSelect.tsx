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
import { FloatingLabelControl } from './FloatingLabelControl'
import { baseClassNames, customComponents, type ClassNamesConfig } from './ReactSelect.styles'
import { VirtualizedMenuList } from './VirtualizedMenuList'

const CreatableAsyncPaginate = withAsyncPaginate(CreatableSelect)

export type Option<ValueType = string | number | boolean> = {
  value: ValueType
  label: string
}

interface ReactSelectProps<
  OptionType extends Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
> extends Omit<SelectProps<OptionType, IsMulti, Group>, 'loadOptions' | 'onChange'> {
  onChange?: (
    newValue: OnChangeValue<OptionType, IsMulti>,
    actionMeta: ActionMeta<OptionType>,
  ) => void
  customClassNames?: ClassNamesConfig
  customStyles?: StylesConfig<OptionType, IsMulti, Group>
  isCreatable?: boolean
  isAsyncPaginate?: boolean
  isVirtualized?: boolean
  loadOptions?: (
    search: string,
    page: number,
  ) => Promise<{
    options: OptionType[]
    hasMore: boolean
  }>
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
  isAsyncPaginate = false,
  isVirtualized = false,
  loadOptions,
  debounceTimeout = 350,
  ...props
}: ReactSelectProps<OptionType, IsMulti, Group>): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!isAsyncPaginate) {
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
  }, [inputValue, debounceTimeout, isAsyncPaginate])

  const loadOptionsAdapter: LoadOptions<OptionType, Group, { page: number }> = useCallback(
    async (search, _loadedOptions, additional) => {
      if (!loadOptions) {
        logger.error('`loadOptions` prop is required when `isAsyncPaginate` is true.')
        return { options: [], hasMore: false }
      }
      setIsLoading(true)
      try {
        const page = additional?.page || 1
        const result = await loadOptions(search, page)
        return {
          options: result.options,
          hasMore: result.hasMore,
          additional: { page: page + 1 },
        }
      } finally {
        setIsLoading(false)
      }
    },
    [loadOptions],
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
    if (isAsyncPaginate) {
      return isCreatable ? CreatableAsyncPaginate : AsyncPaginate
    }
    return isCreatable ? CreatableSelect : Select
  }, [isCreatable, isAsyncPaginate]) as ElementType

  const finalProps = {
    ...props,
    unstyled: true,
    noOptionsMessage: ({ inputValue }: { inputValue: string }) => {
      if (isTyping) return '' // Search
      if (inputValue) return 'Нічого не знайдено' // No results
      return 'Опції відсутні' // No options
    },
    formatCreateLabel: (inputValue: string) => `Додати: "${inputValue}"`,
    styles: {
      ...customStyles,
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

    ...(isAsyncPaginate && {
      loadOptions: loadOptionsAdapter,
      debounceTimeout,
      additional: { page: 1 },
      loadingMessage: () => 'Завантаження...',
      isLoading,
    }),
  }

  return <SelectComponent {...finalProps} />
}

export default ReactSelect

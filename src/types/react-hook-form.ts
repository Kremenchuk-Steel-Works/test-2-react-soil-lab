import type { DeepPartial, SubmitHandler } from 'react-hook-form'
import type { Option } from '@/shared/ui/select/ReactSelect'

/**
 * Универсальный тип для начальных данных формы.
 * @template TFormFields - Тип полей формы (Zod schema output).
 * @template TOptions - Тип для опций селектов. Должен быть объектом,
 * где каждое значение — это массив Option.
 */
export interface FormInitialData<TFormFields, TOptions extends object = {}> {
  /**
   * Начальные значения для полей формы.
   */
  defaultValues?: DeepPartial<TFormFields>

  /**
   * Предустановленные опции для select-полей.
   * Этот mapped type гарантирует, что каждое значение в переданном объекте TOptions
   * будет массивом типа Option.
   */
  options?: {
    [K in keyof TOptions]?: TOptions[K] extends Option<any>[] ? TOptions[K] : never
  }
}

/**
 * Универсальный тип для пропсов компонента-формы.
 * @template TFormFields - Тип полей формы.
 * @template TOptions - Тип для опций селектов, передаваемых в initialData.
 */
export interface FormProps<TFormFields, TOptions extends object = {}> {
  /** Начальные данные для формы. */
  initialData?: FormInitialData<TFormFields, TOptions>

  /** Функция-обработчик успешной отправки формы. */
  onSubmit: SubmitHandler<TFormFields>

  /** Текст на кнопке отправки. Можно сделать опциональным, если есть текст по умолчанию. */
  submitBtnName: string
}

import type { DeepPartial, SubmitHandler } from 'react-hook-form'

/**
 * Универсальный тип для пропсов компонента-формы.
 * @template TFormFields - Тип полей формы (то, с чем работает react-hook-form).
 * @template TResponseData - Тип данных, полученных с бэкенда (полная сущность).
 */
export interface FormProps<TFormFields, TResponseData = unknown> {
  /** Начальные значения для полей формы (уплощенные данные). */
  defaultValues?: DeepPartial<TFormFields>

  /** Полные данные сущности, полученные из ответа API. */
  responseData?: TResponseData

  /** Функция-обработчик успешной отправки формы. */
  onSubmit: SubmitHandler<TFormFields>

  /** Текст на кнопке отправки. */
  submitBtnName: string
}

export interface FormBaseProps<TFormFields, TResponseData = unknown> {
  /** Начальные значения для полей формы (уплощенные данные). */
  defaultValues?: DeepPartial<TFormFields>

  /** Полные данные сущности, полученные из ответа API. */
  responseData?: TResponseData

  /** Текст на кнопке отправки. */
  submitBtnName: string

  isSubmitting?: boolean
}

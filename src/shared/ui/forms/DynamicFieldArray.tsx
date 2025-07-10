import type { ComponentType } from 'react'
import { Plus, X } from 'lucide-react'
import {
  useFieldArray,
  type ArrayPath,
  type Control,
  type FieldArray,
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
} from 'react-hook-form'
import Button from '@/shared/ui/button/Button'
import { FieldsetWrapper } from '@/shared/ui/forms/FieldsetWrapper'

interface DynamicFieldArrayProps<T extends FieldValues, N extends ArrayPath<T> = ArrayPath<T>> {
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  name: N
  form: ComponentType<{
    index: number
    control: Control<T>
    register: UseFormRegister<T>
    errors: FieldErrors<T>
  }>
  defaultItem: FieldArray<T, N>
  title?: string
  label?: string
  addButton?: React.ReactNode
  removeButton?: (onRemove: () => void) => React.ReactNode
}

/**
 * Универсальный компонент для управления динамическим массивом полей в react-hook-form.
 *
 * Является оберткой над хуком `useFieldArray`. Позволяет пользователю добавлять и удалять
 * группы полей (суб-формы), например, несколько телефонных номеров или адресов.
 *
 * @param control - Объект `control` из `useForm`, передается в `useFieldArray`.
 * @param register - Функция `register` из `useForm`, пробрасывается в компонент каждого элемента.
 * @param errors - Объект `errors` из `useForm`, пробрасывается в компонент каждого элемента.
 * @param name - Имя (путь) к полю-массиву в схеме формы (например, 'contacts').
 * @param form - React-компонент, отвечающий за рендеринг UI для **одного элемента** массива.
 * @param defaultItem - Объект со значениями по умолчанию для нового элемента, добавляемого в массив.
 * @param label - Текстовая метка для кастомизации кнопок "Добавить" / "Удалить".
 * @param addButton - Опциональный рендер-проп для полной кастомизации кнопки "Добавить".
 * @param removeButton - Опциональный рендер-проп для полной кастомизации кнопки "Удалить".
 *
 * @example
 * // Внутри формы, для управления списком контактов
 * <DynamicFieldArray
 * control={control}
 * register={register}
 * errors={errors}
 * name="contacts"
 * form={ContactForm} // ContactForm - это компонент для одного контакта
 * defaultItem={{ type: '', value: '' }}
 * label="контакт"
 * />
 */
export function DynamicFieldArray<T extends FieldValues, N extends ArrayPath<T>>({
  control,
  register,
  errors,
  name,
  form: FormComponent,
  defaultItem,
  title,
  label,
  addButton,
  removeButton,
}: DynamicFieldArrayProps<T, N>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <FieldsetWrapper key={field.id} title={title ? `${title} ${index + 1}` : undefined}>
          <FormComponent index={index} control={control} register={register} errors={errors} />
          {removeButton ? (
            removeButton(() => remove(index))
          ) : (
            <Button
              customColor="red"
              className="flex items-center justify-center gap-1 whitespace-nowrap"
              onClick={() => remove(index)}
            >
              <X className="h-5 w-5" />{' '}
              <span>
                Видалити {label} {index + 1}
              </span>
            </Button>
          )}
        </FieldsetWrapper>
      ))}

      {addButton ? (
        <div>{addButton}</div>
      ) : (
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => append(defaultItem)}
        >
          <Plus className="h-5 w-5" /> <span>Додати {label}</span>
        </Button>
      )}
    </div>
  )
}

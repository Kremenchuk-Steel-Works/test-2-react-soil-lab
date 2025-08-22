import { memo, useCallback, type ComponentType, type Key } from 'react'
import clsx from 'clsx'
import { Plus, X } from 'lucide-react'
import {
  useFieldArray,
  useFormContext,
  type ArrayPath,
  type Control,
  type DeepPartial,
  type FieldArray,
  type FieldValues,
  type PathValue,
  type UseFormRegister,
} from 'react-hook-form'
import Button from '@/shared/ui/button/Button'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'

type ArrayElement<T> = T extends readonly (infer U)[] ? U : T extends (infer U)[] ? U : never

export interface DynamicFieldArrayProps<T extends FieldValues, N extends ArrayPath<T>, TItemData> {
  name: N
  form: ComponentType<{
    pathPrefix: `${N}.${number}`
    index?: number
    itemData?: TItemData
    control?: Control<T>
    register?: UseFormRegister<T>
  }>
  itemsData?: TItemData[]
  defaultItem?: DeepPartial<ArrayElement<PathValue<T, N>>>
  title?: string
  label?: string
  addButton?: React.ReactNode
  removeButton?: (onRemove: () => void) => React.ReactNode
}

function DynamicFieldArrayInner<
  T extends FieldValues,
  N extends ArrayPath<T>,
  TItemData extends { id?: Key },
>({
  name,
  form: FormComponent,
  itemsData,
  defaultItem,
  title,
  label,
  addButton,
  removeButton,
}: DynamicFieldArrayProps<T, N, TItemData>) {
  const methods = useFormContext<T>()
  const { control, register } = methods

  const { fields, append, remove } = useFieldArray({ control, name })

  const handleAppend = useCallback(() => {
    append((defaultItem ?? {}) as FieldArray<T, N>, { shouldFocus: false })
  }, [append, defaultItem])

  const makeHandleRemove = useCallback((index: number) => () => remove(index), [remove])

  return (
    <div className="space-y-0">
      <div className="space-y-0 divide-y-2 divide-gray-500/20 dark:divide-gray-950/20">
        {fields.map((field, index) => {
          const pathPrefix = `${name}.${index}` as const
          const itemData = itemsData?.find((d) => d.id === field.id) ?? itemsData?.[index]

          return (
            <FieldsetWrapper
              key={field.id}
              title={title ? `${title} ${index + 1}` : undefined}
              className={clsx('rounded-none', { 'rounded-t-lg': index === 0 })}
              button={
                removeButton ? (
                  removeButton(makeHandleRemove(index))
                ) : (
                  <Button
                    customColor="red"
                    className="flex items-center justify-center gap-1 p-1.5 whitespace-nowrap"
                    onClick={makeHandleRemove(index)}
                  >
                    <X size={18} />
                  </Button>
                )
              }
            >
              <FormComponent
                pathPrefix={pathPrefix}
                index={index}
                itemData={itemData}
                control={control}
                register={register}
              />
            </FieldsetWrapper>
          )
        })}
      </div>

      {addButton ? (
        <div>{addButton}</div>
      ) : (
        <div
          className={clsx({
            'rounded-b-lg bg-gray-400/20 px-4 pb-4 dark:bg-gray-950/20': fields.length > 0,
          })}
        >
          <Button
            className="flex items-center justify-center gap-1 whitespace-nowrap"
            onClick={handleAppend}
          >
            <Plus className="h-5 w-5" /> <span>Додати {label}</span>
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Универсальный компонент для управления динамическим массивом полей в react-hook-form.
 *
 * Является оберткой над хуком `useFieldArray`. Позволяет пользователю добавлять и удалять
 * группы полей (суб-формы), например, несколько телефонных номеров или адресов.
 *
 * @param control - Объект `control` из `useForm`, передается в `useFieldArray`.
 * @param register - Функция `register` из `useForm`, пробрасывается в компонент каждого элемента.
 * @param name - Имя (путь) к полю-массиву в схеме формы (например, 'contacts').
 * @param form - React-компонент, отвечающий за рендеринг UI для **одного элемента** массива.
 * @param defaultItem - Объект со значениями по умолчанию для нового элемента, добавляемого в массив.
 * @param addButton - Опциональный рендер-проп для полной кастомизации кнопки "Добавить".
 * @param removeButton - Опциональный рендер-проп для полной кастомизации кнопки "Удалить".
 *
 */
export const DynamicFieldArray = memo(DynamicFieldArrayInner) as typeof DynamicFieldArrayInner

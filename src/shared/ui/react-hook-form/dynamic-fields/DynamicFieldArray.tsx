// shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray.tsx

import type { ComponentType, Key } from 'react'
import clsx from 'clsx'
import { Plus, X } from 'lucide-react'
import {
  useFieldArray,
  useFormContext,
  type ArrayPath,
  type DeepPartial,
  type FieldArray,
  type FieldValues,
} from 'react-hook-form'
import Button from '@/shared/ui/button/Button'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'

// Обновили интерфейс: теперь FormComponent принимает pathPrefix
export interface DynamicFieldArrayProps<T extends FieldValues, N extends ArrayPath<T>, TItemData> {
  name: N
  // `form` теперь принимает `itemData` - срез данных для этого конкретного элемента
  form: ComponentType<{
    pathPrefix: `${N}.${number}`
    index: number
    itemData?: TItemData // Данные для одного элемента
  }>
  itemsData?: TItemData[] // Массив данных для всех элементов
  defaultItem?: DeepPartial<FieldArray<T, N>>
  title?: string
  label?: string
  addButton?: React.ReactNode
  removeButton?: (onRemove: () => void) => React.ReactNode
}

export function DynamicFieldArray<
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
  const { control } = useFormContext<T>()
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const handleAppend = () => {
    append(defaultItem as FieldArray<T, ArrayPath<T>>, {
      shouldFocus: false,
    })
  }

  const handleRemove = (index: number) => () => {
    remove(index)
  }

  return (
    <div className="space-y-0">
      <div className="space-y-0 divide-y-2 divide-gray-500/20 dark:divide-gray-950/20">
        {fields.map((field, index) => {
          const pathPrefix = `${name}.${index}` as const
          // Находим данные для этого конкретного элемента по его ID, если он есть, иначе по индексу
          const itemData = itemsData?.find((data) => data.id === field.id) ?? itemsData?.[index]

          return (
            <FieldsetWrapper
              key={field.id}
              title={title ? `${title} ${index + 1}` : undefined}
              className={clsx('rounded-none', {
                'rounded-t-lg': index === 0,
              })}
              button={
                removeButton ? (
                  removeButton(handleRemove(index))
                ) : (
                  <Button
                    customColor="red"
                    className="flex items-center justify-center gap-1 p-1.5 whitespace-nowrap"
                    onClick={handleRemove(index)}
                  >
                    <X size={18} />
                  </Button>
                )
              }
            >
              <FormComponent pathPrefix={pathPrefix} index={index} itemData={itemData} />
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

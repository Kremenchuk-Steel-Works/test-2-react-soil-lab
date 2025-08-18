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
  type UseFormRegister,
} from 'react-hook-form'
import Button from '@/shared/ui/button/Button'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'

export interface DynamicFieldArrayProps<T extends FieldValues, N extends ArrayPath<T>, TItemData> {
  name: N
  form: ComponentType<{
    pathPrefix: `${N}.${number}`
    index: number
    itemData?: TItemData
    control: Control<T>
    register: UseFormRegister<T>
  }>
  itemsData?: TItemData[]
  defaultItem?: DeepPartial<FieldArray<T, N>>
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
    append(defaultItem as FieldArray<T, ArrayPath<T>>, { shouldFocus: false })
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

export const DynamicFieldArray = memo(DynamicFieldArrayInner) as typeof DynamicFieldArrayInner

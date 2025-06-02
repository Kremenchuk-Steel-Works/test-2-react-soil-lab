import type { ComponentType } from "react"
import {
  useFieldArray,
  type ArrayPath,
  type Control,
  type FieldArray,
  type FieldErrors,
  type FieldValues,
  type UseFormRegister,
} from "react-hook-form"
import Button from "../Button/Button"
import { Plus, X } from "lucide-react"

interface DynamicFieldArrayProps<
  T extends FieldValues,
  N extends ArrayPath<T> = ArrayPath<T>
> {
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
  label?: string
  addButton?: React.ReactNode
  removeButton?: (onRemove: () => void) => React.ReactNode
}

export function DynamicFieldArray<
  T extends FieldValues,
  N extends ArrayPath<T>
>({
  control,
  register,
  errors,
  name,
  form: FormComponent,
  defaultItem,
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
        <div key={field.id} className="space-y-3">
          <FormComponent
            index={index}
            control={control}
            register={register}
            errors={errors}
          />
          {removeButton ? (
            removeButton(() => remove(index))
          ) : (
            <Button
              customColor="red"
              className="flex items-center justify-center gap-1 whitespace-nowrap"
              onClick={() => remove(index)}
            >
              <X className="w-5 h-5" /> <span>Видалити {label}</span>
            </Button>
          )}
        </div>
      ))}

      {addButton ? (
        <div>{addButton}</div>
      ) : (
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => append(defaultItem)}
        >
          <Plus className="w-5 h-5" /> <span>Додати {label}</span>
        </Button>
      )}
    </div>
  )
}

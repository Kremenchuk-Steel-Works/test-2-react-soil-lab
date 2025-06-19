import {
  useWatch,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormRegister,
  type UseFormResetField,
  type UseFormSetValue,
} from "react-hook-form"
import Button from "../button123/Button"
import { Plus, X } from "lucide-react"

interface OptionalFieldProps<
  T extends FieldValues,
  K extends Path<T> = Path<T>
> {
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  resetField: UseFormResetField<T>
  setValue: UseFormSetValue<T>
  form: React.ComponentType<{
    control: Control<T>
    register: UseFormRegister<T>
    errors: FieldErrors<T>
  }>
  name: K
  defaultItem: Partial<PathValue<T, K>>
  label?: string
  addButton?: React.ReactNode
  removeButton?: (onRemove: () => void) => React.ReactNode
}

export function OptionalField<
  T extends FieldValues,
  K extends Path<T> = Path<T>
>({
  control,
  register,
  errors,
  setValue,
  form: FormComponent,
  label,
  removeButton,
  name,
  defaultItem,
}: OptionalFieldProps<T, K>) {
  const fieldValue = useWatch({ control, name })
  const isVisible = fieldValue !== undefined && fieldValue !== null

  const handleAdd = () => {
    setValue(name, defaultItem as PathValue<T, K>, { shouldValidate: false })
  }

  const handleRemove = () => {
    setValue(name, undefined as PathValue<T, K>, { shouldDirty: true })
  }

  return (
    <div className="space-y-3">
      {isVisible ? (
        <div className="space-y-3">
          <FormComponent
            control={control}
            register={register}
            errors={errors}
          />
          {removeButton ? (
            removeButton(handleRemove)
          ) : (
            <Button
              customColor="red"
              className="flex items-center justify-center gap-1 whitespace-nowrap"
              onClick={handleRemove}
            >
              <X className="w-5 h-5" /> <span>Видалити {label}</span>
            </Button>
          )}
        </div>
      ) : (
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={handleAdd}
        >
          <Plus className="w-5 h-5" /> <span>Додати {label}</span>
        </Button>
      )}
    </div>
  )
}

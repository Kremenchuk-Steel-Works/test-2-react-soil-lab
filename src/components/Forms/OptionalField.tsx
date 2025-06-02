import { useState } from "react"
import {
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from "react-hook-form"
import Button from "../Button/Button"
import { Plus, X } from "lucide-react"

interface OptionalFieldProps<T extends FieldValues> {
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  resetField: (name: Path<T>) => void
  form: React.ComponentType<{
    control: Control<T>
    register: UseFormRegister<T>
    errors: FieldErrors<T>
  }>
  label?: string
  addButton?: React.ReactNode
  removeButton?: (onRemove: () => void) => React.ReactNode
  name: string
}

export function OptionalField<T extends FieldValues>({
  control,
  register,
  errors,
  resetField,
  form: FormComponent,
  label,
  addButton,
  removeButton,
  name,
}: OptionalFieldProps<T>) {
  const [isVisible, setIsVisible] = useState(false)

  const handleToggle = () => {
    if (isVisible) {
      resetField(name as Path<T>)
    }
    setIsVisible((prev) => !prev)
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
            removeButton(handleToggle)
          ) : (
            <Button
              customColor="red"
              className="flex items-center justify-center gap-1 whitespace-nowrap"
              onClick={handleToggle}
            >
              <X className="w-5 h-5" /> <span>Видалити {label}</span>
            </Button>
          )}
        </div>
      ) : addButton ? (
        <div>{addButton}</div>
      ) : (
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={handleToggle}
        >
          <Plus className="w-5 h-5" /> <span>Додати {label}</span>
        </Button>
      )}
    </div>
  )
}

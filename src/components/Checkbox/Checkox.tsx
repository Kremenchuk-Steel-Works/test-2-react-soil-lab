import { twMerge } from "tailwind-merge"
import { Check } from "lucide-react"

export type CheckboxProps = {
  label: string
  id?: string
  classNameInput?: string
  classNameLabel?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  id,
  classNameInput,
  classNameLabel,
  ...inputProps
}) => {
  const checkboxId = id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`

  return (
    <label
      htmlFor={checkboxId}
      className={twMerge(
        "flex items-center gap-2 text-sm cursor-pointer select-none",
        classNameLabel
      )}
    >
      <input
        id={checkboxId}
        type="checkbox"
        className={twMerge("peer hidden", classNameInput)}
        {...inputProps}
      />

      <div
        className={twMerge(`
      group relative h-5 w-5 rounded-md border-0 dark:border-gray-600bg-white dark:bg-gray-700 transition-color duration-300 peer-checked:bg-blue-600
    `)}
      >
        <Check
          className={twMerge(`
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 transition-all duration-300 opacity-0 group-peer-checked:opacity-100
      `)}
          strokeWidth={3}
        />
      </div>

      <span>{label}</span>
    </label>
  )
}

export default Checkbox

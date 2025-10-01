import { Check } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export type CheckboxProps = {
  label: string
  id?: string
  classNameInput?: string
  classNameLabel?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>

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
        'flex cursor-pointer items-center gap-2 text-sm select-none',
        classNameLabel,
      )}
    >
      <input
        id={checkboxId}
        type="checkbox"
        className={twMerge('peer hidden', classNameInput)}
        {...inputProps}
      />

      <div
        className={twMerge(
          `group relative h-5 w-5 rounded-xl border border-gray-300 bg-white text-white transition-colors duration-200 peer-checked:border-blue-600 peer-checked:bg-blue-600 dark:border-gray-600 dark:bg-gray-700`,
        )}
      >
        <Check
          className={twMerge(
            `absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-200 group-peer-checked:opacity-100`,
          )}
          strokeWidth={3}
        />
      </div>

      <span>{label}</span>
    </label>
  )
}

export default Checkbox

export type InputFieldProps = {
  label: string
} & React.InputHTMLAttributes<HTMLInputElement>

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
  return (
    <div className="relative w-full">
      <input
        {...props}
        className={`
          peer
          w-full px-4 pt-5 pb-2 border border-gray-300 dark:border-gray-600 rounded-md
          bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
        placeholder=" "
      />
      <label
        className={`
          absolute left-4 top-1 text-gray-500 dark:text-gray-400
          text-sm transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
          peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none
        `}
      >
        {label}
      </label>
    </div>
  )
}

export default InputField

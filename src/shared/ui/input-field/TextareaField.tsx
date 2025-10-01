import React, { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react'
import { useScrollLock } from '@/shared/hooks/useScrollLock'

export type TextareaFieldProps = {
  label: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, id, className, style, ...props }, ref) => {
    const localRef = useRef<HTMLTextAreaElement>(null)
    useImperativeHandle(ref, () => localRef.current as HTMLTextAreaElement, [localRef])

    const generatedId = useId()
    const finalId = id || generatedId

    const [height, setHeight] = useState<number | undefined>(undefined)
    const startY = useRef<number>(0)
    const startH = useRef<number>(0)

    useScrollLock(localRef)

    const onMouseDown = (e: React.MouseEvent) => {
      e.preventDefault()
      startY.current = e.clientY
      startH.current = localRef.current!.getBoundingClientRect().height
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      document.body.style.userSelect = 'none'
    }

    const onMouseMove = (e: MouseEvent) => {
      const dy = e.clientY - startY.current
      const newH = Math.max(startH.current + dy, 20)
      setHeight(newH)
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.style.userSelect = ''
    }

    return (
      <div className={`relative w-full ${className || ''}`} style={style}>
        <textarea
          rows={2}
          ref={localRef}
          id={finalId}
          {...props}
          style={{ height, resize: 'none' }}
          className={`peer min-h-[78px] w-full resize-y rounded-xl border border-gray-300 bg-gray-50 px-4 pt-5 pb-2 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 ${className || ''} `}
          placeholder=" "
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[1px] right-4 left-[1px] h-5 rounded-tl-md bg-gray-50 peer-focus:bg-gray-50 dark:bg-gray-700 dark:peer-focus:bg-gray-700"
        />

        <label
          htmlFor={finalId}
          className={`pointer-events-none absolute top-1 left-4 inline-block w-full truncate pr-5 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 dark:text-gray-400`}
        >
          {label}
        </label>

        <div
          onMouseDown={onMouseDown}
          className="absolute right-0 bottom-0 left-0 h-3 cursor-n-resize bg-transparent"
        />
      </div>
    )
  },
)

export default TextareaField

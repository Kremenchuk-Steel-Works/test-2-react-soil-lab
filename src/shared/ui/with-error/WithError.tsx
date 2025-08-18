import React from 'react'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

type WithErrorProps = {
  errorMessage?: string
  children?: React.ReactNode
  className?: string
  /** id элемента с текстом ошибки для aria-describedby */
  errorId?: string
  /** роль live-региона; по умолчанию "alert" */
  role?: 'alert' | 'status'
}

/**
 * Обёртка-контейнер для полей с ошибками
 */
export function WithError({
  errorMessage,
  children,
  className,
  errorId,
  role = 'alert',
}: WithErrorProps) {
  return (
    <div className={`space-y-2${className ? ` ${className}` : ''}`}>
      {children}
      {errorMessage && (
        <div id={errorId} role={role} aria-live="polite">
          <AlertMessage type={AlertType.ERROR} message={errorMessage} />
        </div>
      )}
    </div>
  )
}

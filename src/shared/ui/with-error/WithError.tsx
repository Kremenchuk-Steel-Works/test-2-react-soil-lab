import React from 'react'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

type WithErrorProps = {
  errorMessage?: string
  children: React.ReactNode
}

/**
 * Обёртка-контейнер для полей с ошибками
 */
export function WithError({ errorMessage, children }: WithErrorProps) {
  return (
    <div className="space-y-2">
      {children}
      {errorMessage && <AlertMessage type={AlertType.ERROR} message={errorMessage} />}
    </div>
  )
}

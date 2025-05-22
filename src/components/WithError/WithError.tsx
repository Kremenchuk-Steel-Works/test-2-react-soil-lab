import React from "react"
import AlertMessage, { AlertType } from "../AlertMessage"

export type WithErrorProps = {
  errorMessage?: string
}

export function withError<P extends object>(Component: React.ComponentType<P>) {
  return function ComponentWithError({
    errorMessage,
    ...props
  }: P & WithErrorProps) {
    return (
      <div className="space-y-2">
        <Component {...(props as P)} />
        {errorMessage && (
          <AlertMessage type={AlertType.ERROR} message={errorMessage} />
        )}
      </div>
    )
  }
}

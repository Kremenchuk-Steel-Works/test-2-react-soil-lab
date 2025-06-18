import React from "react"
import AlertMessage, { AlertType } from "../AlertMessage/AlertMessage"

export type WithErrorProps = {
  errorMessage?: string
}

export function withError<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & WithErrorProps> {
  return function ComponentWithError(props) {
    const { errorMessage, ...rest } = props
    return (
      <div className="space-y-2">
        <Component {...(rest as P)} />
        {errorMessage && (
          <AlertMessage type={AlertType.ERROR} message={errorMessage} />
        )}
      </div>
    )
  }
}

import React from 'react'
import {
  Controller,
  useFormContext,
  useFormState,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type PathValue,
  type RegisterOptions,
  type UseFormRegisterReturn,
} from 'react-hook-form'
import { getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { WithError as ErrorWrap } from '@/shared/ui/with-error/WithError' // общий визуальный контейнер
import { nameToId } from '@/utils/react-hook-form/nameToId'

function ErrorBlock({ id, message }: { id: string; message: string }) {
  return (
    <div id={id} role="alert" aria-live="polite">
      <AlertMessage type={AlertType.ERROR} message={message} />
    </div>
  )
}

export function createFormKit<T extends FieldValues>() {
  type N = Path<T>
  type NameLike = N | 'root'
  type NamesProp = NameLike | NameLike[]

  const normalize = (name: NamesProp): NameLike[] => (Array.isArray(name) ? name : [name])

  const collectMessages = (names: NameLike[], allErrors: any) => {
    const msgs: { name: NameLike; message: string; id: string }[] = []
    for (const n of names) {
      if (n === 'root') {
        const message = allErrors?.root?.message as string | undefined
        if (message) msgs.push({ name: 'root', message, id: 'form-root__error' })
        continue
      }
      const message = getNestedErrorMessage(allErrors, n)
      if (message) {
        const id = `${nameToId(String(n))}__error`
        msgs.push({ name: n, message, id })
      }
    }
    return msgs
  }

  const Message = React.memo(
    ({ name, show = 'all' as const }: { name: NamesProp; show?: 'first' | 'all' }) => {
      const { control, formState } = useFormContext<T>()
      const names = normalize(name)
      const fieldNames = names.filter((n): n is N => n !== 'root')

      if (fieldNames.length === 0) {
        const rootMsg = (formState.errors as any)?.root?.message as string | undefined
        if (!rootMsg) return null
        return <ErrorBlock id="form-root__error" message={rootMsg} />
      }

      const { errors } = useFormState<T>({ control, name: fieldNames })
      const msgs = collectMessages(names, { ...errors, root: (formState.errors as any)?.root })

      if (msgs.length === 0) return null
      if (show === 'first') {
        const m = msgs[0]
        return <ErrorBlock id={m.id} message={m.message} />
      }
      return (
        <>
          {msgs.map((m) => (
            <ErrorBlock key={m.id} id={m.id} message={m.message} />
          ))}
        </>
      )
    },
  )

  const WithError = React.memo(
    ({
      name,
      show = 'first',
      className,
      children,
    }: {
      name: NamesProp
      show?: 'first' | 'all'
      className?: string
      children: React.ReactNode
    }) => (
      <ErrorWrap className={className}>
        {children}
        <Message name={name} show={show} />
      </ErrorWrap>
    ),
  )

  const ControllerField = React.memo(
    ({
      name,
      rules,
      defaultValue,
      shouldUnregister,
      className,
      children,
    }: {
      name: N
      rules?: RegisterOptions<T, N>
      defaultValue?: PathValue<T, N>
      shouldUnregister?: boolean
      className?: string
      children: (p: {
        field: ControllerRenderProps<T, N>
        fieldState: ControllerFieldState
        inputId: string
        describedById?: string
      }) => React.ReactElement
    }) => {
      const { control } = useFormContext<T>()
      const { errors } = useFormState<T>({ control, name: [name] })
      const errorMessage = getNestedErrorMessage(errors, name)
      const inputId = nameToId(String(name))
      const errorId = `${inputId}__error`
      const describedById = errorMessage ? errorId : undefined

      return (
        <ErrorWrap errorMessage={errorMessage} errorId={errorId} className={className}>
          <Controller
            name={name}
            control={control}
            rules={rules}
            defaultValue={defaultValue}
            shouldUnregister={shouldUnregister}
            render={({ field, fieldState }) =>
              children({ field, fieldState, inputId, describedById })
            }
          />
        </ErrorWrap>
      )
    },
  )

  const Field = React.memo(
    ({
      name,
      registerOptions,
      className,
      children,
    }: {
      name: N
      registerOptions?: RegisterOptions<T, N>
      className?: string
      children: (p: {
        register: UseFormRegisterReturn
        inputId: string
        describedById?: string
      }) => React.ReactElement
    }) => {
      const { register, control } = useFormContext<T>()
      const { errors } = useFormState<T>({ control, name: [name] })
      const errorMessage = getNestedErrorMessage(errors, name)
      const inputId = nameToId(String(name))
      const errorId = `${inputId}__error`
      const describedById = errorMessage ? errorId : undefined
      const reg = register(name, registerOptions)

      return (
        <ErrorWrap errorMessage={errorMessage} errorId={errorId} className={className}>
          {children({ register: reg, inputId, describedById })}
        </ErrorWrap>
      )
    },
  )

  return { Field, Controller: ControllerField, Message, WithError }
}

export type FormKit<T extends FieldValues> = ReturnType<typeof createFormKit<T>>

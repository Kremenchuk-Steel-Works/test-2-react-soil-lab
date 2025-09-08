import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { FR_LOGIN as FR } from '@/entities/auth/login/model/fields-registry'
import type { TokenPairResponse } from '@/shared/api/soil-lab/model'
import Button from '@/shared/ui/button/Button'
import Checkbox from '@/shared/ui/checkbox/Checkbox'
import InputField from '@/shared/ui/input-field/InputField'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

type Ctx = { responseData?: TokenPairResponse }

export function useLoginFormFields<T extends FieldValues>(Form: FormKit<T>, ctx: Ctx) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, V } = makeBinders<T, Ctx>(ctxRef)

    return Object.freeze({
      [FR.email.key]: F(FR.email.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => <InputField label={FR.email.label.default + ' *'} {...register} />}
        </Form.Field>
      )),

      [FR.password.key]: F(FR.password.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => (
            <InputField type="password" label={FR.password.label.default + ' *'} {...register} />
          )}
        </Form.Field>
      )),

      [FR.rememberMe.key]: F(FR.rememberMe.key, (name) => (
        <Form.Field name={name}>
          {({ register }) => <Checkbox label={FR.rememberMe.label.default} {...register} />}
        </Form.Field>
      )),

      SubmitButton: V(
        'SubmitButton',
        ({ text, disabled }: { text: string; disabled?: boolean }) => (
          <Form.WithError name="root">
            <Button className="w-full" type="submit" disabled={disabled}>
              {text}
            </Button>
          </Form.WithError>
        ),
      ),
    } as const)
  }, [Form])

  return Fields
}

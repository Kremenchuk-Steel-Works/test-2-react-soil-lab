import { useMemo, useRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import { measurementsGenerateReportFieldRegistry } from '@/features/soil-lab/measurements/generate-report/model/fields-registry'
import type { MeasurementDetailResponse } from '@/shared/api/soil-lab/model'
import Button from '@/shared/ui/button/Button'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import type { FormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'
import { makeBinders } from '@/utils/react-hook-form/makeBinders'

type Ctx = { responseData?: MeasurementDetailResponse }

export function useMeasurementsGenerateReportFormFields<T extends FieldValues>(
  Form: FormKit<T>,
  ctx: Ctx,
) {
  const ctxRef = useRef(ctx)
  ctxRef.current = ctx

  const Fields = useMemo(() => {
    const { F, V } = makeBinders<T, Ctx>(ctxRef)

    const { dateFrom, dateTo } = measurementsGenerateReportFieldRegistry

    return Object.freeze({
      Title: V('Title', () => <h5 className="layout-text">Завантажити звіт </h5>),

      [dateFrom.key]: F(dateFrom.key, (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormDateTimeField
              field={field}
              fieldState={fieldState}
              type="date"
              label={dateFrom.label.default}
            />
          )}
        </Form.Controller>
      )),

      [dateTo.key]: F(dateTo.key, (name) => (
        <Form.Controller name={name}>
          {({ field, fieldState }) => (
            <FormDateTimeField
              field={field}
              fieldState={fieldState}
              type="date"
              offsetFuture={{ days: 1 }}
              label={dateTo.label.default}
            />
          )}
        </Form.Controller>
      )),

      SubmitButton: V(
        'SubmitButton',
        ({ text, disabled }: { text?: string; disabled?: boolean }) => (
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

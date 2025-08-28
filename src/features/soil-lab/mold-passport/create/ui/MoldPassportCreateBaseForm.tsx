import {
  useMoldPassportFormFields,
  type MoldPassportFormOptions,
} from '@/entities/soil-lab/mold-passport'
import type { MoldPassportCreateFormFields } from '@/features/soil-lab/mold-passport/create/model/schema'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { logger } from '@/shared/lib/logger'
import { useFormKit } from '@/shared/ui/react-hook-form/FormKit/formKitContext'
import type { FormBaseProps } from '@/types/react-hook-form'

type Options = Pick<
  MoldPassportFormOptions,
  | 'loadMoldingAreas'
  | 'defaultMoldingAreas'
  | 'loadPatternPlateFrames'
  | 'defaultPatternPlateFrames'
  | 'loadMoldingFlasks'
  | 'defaultMoldingFlasks'
>

type MoldPassportCreateBaseFormFieldsProps = {
  options: Options
}

export type MoldPassportCreateBaseFormProps = FormBaseProps<
  MoldPassportCreateFormFields,
  MoldPassportDetailResponse
> &
  MoldPassportCreateBaseFormFieldsProps

export function MoldPassportCreateBaseForm({
  options,
  isSubmitting,
  responseData,
  submitBtnName,
}: MoldPassportCreateBaseFormProps) {
  const Form = useFormKit<MoldPassportCreateFormFields>()
  const F = useMoldPassportFormFields(Form, {
    options,
    responseData,
  })

  logger.debug('[MoldPassportForm] FIELDS render')
  return (
    <>
      <h5 className="layout-text">Паспорт ливарної форми</h5>

      {/* <AlertMessage type={AlertType.WARNING} message={`Попередній стан форми: Не заповнено`} /> */}

      <F.MoldingAreaSelect />

      {/* DynamicFields */}
      <F.MoldingAreaDynamic />
      {/* <DynamicFieldArea section="moldingAreaId" showInactive /> */}

      <F.PatternPlateFrameSelect />

      <F.MoldingFlaskSelect />

      {/* DynamicFields */}
      <F.CastingTechnologyDynamic />

      {/* Cavities */}
      <F.MoldCavitiesArray />

      <F.PressingPressureField />

      <F.SequenceInShiftField />

      <F.AssemblyTimestampField />

      <F.IsDefectiveField />

      <F.NotesField />

      <F.SubmitButton text={submitBtnName} disabled={isSubmitting} />
    </>
  )
}

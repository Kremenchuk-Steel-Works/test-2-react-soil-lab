import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
} from "../../../../components/WithError/fieldsWithError"
import { positionsSchema, type PositionsFormFields } from "./schema"
import { logger } from "../../../../utils/logger"
import { formTransformers } from "../../../../utils/formTransformers"

type FormFields = PositionsFormFields
const schema = positionsSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function PositionsForm({
  defaultValues,
  onSubmit,
  submitBtnName,
}: FormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const submitHandler: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await onSubmit(data)
      logger.debug("Форма успешно выполнена", response)
    } catch (err) {
      const error = err as Error
      setError("root", { message: error.message })
      logger.error(err)
    }
  }

  console.log(errors)

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Назва"
        errorMessage={errors.name?.message}
        {...register("name", formTransformers.string)}
      />

      <InputFieldWithError
        label="Опис"
        errorMessage={errors.description?.message}
        {...register("description", formTransformers.string)}
      />

      <ButtonWithError
        className="w-full"
        type="submit"
        errorMessage={errors.root?.message}
        disabled={isSubmitting}
      >
        {submitBtnName}
      </ButtonWithError>
    </form>
  )
}

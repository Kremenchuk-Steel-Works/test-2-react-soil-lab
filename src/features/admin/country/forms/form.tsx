import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
} from "../../../../components/WithError/fieldsWithError"
import { logger } from "../../../../utils/logger"
import { countrySchema, type CountryFormFields } from "./schema"
import { formTransformers } from "../../../../utils/formTransformers"

type FormFields = CountryFormFields
const schema = countrySchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function CountryForm({
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

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Назва"
        errorMessage={errors.name?.message}
        {...register("name", formTransformers.string)}
      />

      <InputFieldWithError
        label="Локальна назва"
        errorMessage={errors.nameLocal?.message}
        {...register("nameLocal", formTransformers.string)}
      />

      <InputFieldWithError
        label="Код 2"
        errorMessage={errors.code?.message}
        {...register("code", formTransformers.string)}
      />

      <InputFieldWithError
        label="Код 3"
        errorMessage={errors.code3?.message}
        {...register("code3", formTransformers.string)}
      />

      <InputFieldWithError
        label="Номер"
        errorMessage={errors.numericCode?.message}
        {...register("numericCode", formTransformers.string)}
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

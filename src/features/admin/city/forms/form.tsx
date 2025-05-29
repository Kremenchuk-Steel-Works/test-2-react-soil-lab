import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
} from "../../../../components/WithError/fieldsWithError"
import { logger } from "../../../../utils/logger"
import { citySchema, type CityFormFields } from "./schema"
import { formTransformers } from "../../../../utils/formTransformers"

type FormFields = CityFormFields
const schema = citySchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function CityForm({
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
        label="Країна ID"
        type="number"
        errorMessage={errors.countryId?.message}
        {...register("countryId", formTransformers.number)}
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

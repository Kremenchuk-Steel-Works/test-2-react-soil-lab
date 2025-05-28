import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
} from "../../../../components/WithError/fieldsWithError"
import { organizationsSchema, type OrganizationsFormFields } from "./schema"
import { logger } from "../../../../utils/logger"
import { ContactForm } from "../../contact/forms/form"
import { AddressForm } from "../../address/forms/form"
import { formTransformers } from "../../../../utils/formTransformers"

type FormFields = OrganizationsFormFields
const schema = organizationsSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function OrganizationsForm({
  defaultValues,
  onSubmit,
  submitBtnName,
}: FormProps) {
  const {
    register,
    handleSubmit,
    control,
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
        errorMessage={errors.legalName?.message}
        {...register("legalName")}
      />

      <InputFieldWithError
        label="Номер реєстрації"
        errorMessage={errors.registrationNumber?.message}
        {...register("registrationNumber")}
      />

      <InputFieldWithError
        label="ІПН"
        errorMessage={errors.taxId?.message}
        {...register("taxId")}
      />

      <InputFieldWithError
        label="Країна ID"
        type="number"
        errorMessage={errors.countryId?.message}
        {...register("countryId", formTransformers.number)}
      />

      <ContactForm<OrganizationsFormFields>
        control={control}
        register={register}
        errors={errors}
      />

      <AddressForm<OrganizationsFormFields>
        control={control}
        register={register}
        errors={errors}
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

import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
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
import Button from "../../../../components/Button/Button"
import { Plus, X } from "lucide-react"

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

  const {
    fields: contactFields,
    append: contactAppend,
    remove: contactRemove,
  } = useFieldArray({
    control,
    name: "contacts",
  })
  const {
    fields: addressFields,
    append: addressAppend,
    remove: addressRemove,
  } = useFieldArray({
    control,
    name: "addresses",
  })

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Назва"
        errorMessage={errors.legalName?.message}
        {...register("legalName", formTransformers.string)}
      />

      <InputFieldWithError
        label="Номер реєстрації"
        errorMessage={errors.registrationNumber?.message}
        {...register("registrationNumber", formTransformers.string)}
      />

      <InputFieldWithError
        label="ІПН"
        errorMessage={errors.taxId?.message}
        {...register("taxId", formTransformers.string)}
      />

      <InputFieldWithError
        label="Країна ID"
        type="number"
        errorMessage={errors.countryId?.message}
        {...register("countryId", formTransformers.number)}
      />

      {/* Contacts */}
      {contactFields.map((field, index) => (
        <div key={field.id} className="space-y-3">
          <ContactForm
            index={index}
            control={control}
            register={register}
            errors={errors}
          />
          <Button
            customColor="red"
            className="flex items-center justify-center gap-1 whitespace-nowrap"
            onClick={() => contactRemove(index)}
          >
            <X className="w-5 h-5" /> <span>Видалити</span>
          </Button>
        </div>
      ))}

      <Button
        className="flex items-center justify-center gap-1 whitespace-nowrap"
        onClick={() =>
          contactAppend({ value: "", type: "email", isPrimary: false })
        }
      >
        <Plus className="w-5 h-5" /> <span>Додати контакт</span>
      </Button>

      {/* Address */}
      {addressFields.map((field, index) => (
        <div key={field.id} className="space-y-3">
          <AddressForm
            index={index}
            control={control}
            register={register}
            errors={errors}
          />
          <Button
            customColor="red"
            className="flex items-center justify-center gap-1 whitespace-nowrap"
            onClick={() => addressRemove(index)}
          >
            <X className="w-5 h-5" /> <span>Видалити</span>
          </Button>
        </div>
      ))}

      <Button
        className="flex items-center justify-center gap-1 whitespace-nowrap"
        onClick={() =>
          addressAppend({
            type: "home",
            isPrimary: false,
            street: "",
            cityName: "",
            countryName: "",
            postalCode: "",
            note: "",
          })
        }
      >
        <Plus className="w-5 h-5" /> <span>Додати адресу</span>
      </Button>

      {/* Submit */}
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

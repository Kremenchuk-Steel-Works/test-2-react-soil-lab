import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  ReactSelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import { organizationsSchema, type OrganizationsFormFields } from "./schema"
import { logger } from "../../../../utils/logger"
import { ContactForm } from "../../contact/forms/form"
import { AddressForm } from "../../address/forms/form"
import { formTransformers } from "../../../../utils/formTransformers"
import { DynamicFieldArray } from "../../../../components/Forms/DynamicFieldArray"
import { mockCountries } from "../../country/mocks/mock"

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

  const countriesData = mockCountries
  const countriesOptions = [
    ...countriesData.map((obj) => ({
      value: obj.id,
      label: obj.name,
    })),
  ]

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

      <Controller
        name={`countryId`}
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть країну"
            isClearable={true}
            options={countriesOptions}
            value={countriesOptions.find((opt) => opt.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={errors.countryId?.message}
          />
        )}
      />

      {/* Contacts */}
      <DynamicFieldArray
        name="contacts"
        label="контакт"
        form={ContactForm<OrganizationsFormFields>}
        defaultItem={{ value: undefined!, type: undefined!, isPrimary: false }}
        control={control}
        register={register}
        errors={errors}
      />

      {/* Address */}
      <DynamicFieldArray
        label="адресу"
        name="addresses"
        form={AddressForm<OrganizationsFormFields>}
        defaultItem={{
          type: undefined!,
          isPrimary: undefined!,
          street: undefined!,
          cityId: undefined!,
        }}
        control={control}
        register={register}
        errors={errors}
      />

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

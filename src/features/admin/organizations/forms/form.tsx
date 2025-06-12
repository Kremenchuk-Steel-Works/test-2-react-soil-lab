import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  ReactSelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import { organizationsSchema, type OrganizationsFormFields } from "./schema"
import { ContactForm } from "../../contact/forms/form"
import { AddressForm } from "../../address/forms/form"
import { DynamicFieldArray } from "../../../../components/Forms/DynamicFieldArray"
import type { Option } from "../../../../components/Select/ReactSelect"
import AlertMessage, { AlertType } from "../../../../components/AlertMessage"
import { countryService } from "../../country/services/service"
import type { CountryLookupResponse } from "../../country/types/response.dto"
import { useQuery } from "@tanstack/react-query"
import { logger } from "../../../../lib/logger"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../lib/react-hook-form"

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

  // Query
  const {
    data: countriesData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CountryLookupResponse[], Error>({
    queryKey: ["adminCountryLookupData"],
    queryFn: () => countryService.getLookup(),
  })

  // Loading || Error
  if (isLoading) return
  if (isError) {
    return <AlertMessage type={AlertType.ERROR} message={queryError.message} />
  }

  // Options
  const countriesOptions: Option[] =
    countriesData?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Назва"
        {...register("legalName", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "legalName")}
      />

      <InputFieldWithError
        label="Номер реєстрації"
        {...register("registrationNumber", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "registrationNumber")}
      />

      <InputFieldWithError
        label="ІПН"
        {...register("taxId", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "taxId")}
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
            errorMessage={getNestedErrorMessage(errors, "countryId")}
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

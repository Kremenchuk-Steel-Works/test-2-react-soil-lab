import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
} from "../../../../components/WithError/fieldsWithError"
import { citySchema, type CityFormFields } from "./schema"
import AlertMessage, { AlertType } from "../../../../components/AlertMessage"
import { useQuery } from "@tanstack/react-query"
import type { CountryLookupResponse } from "../../country/types/response.dto"
import { countryService } from "../../country/services/service"
import type { Option } from "../../../../components/Select/ReactSelect"
import { logger } from "../../../../lib/logger"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../lib/react-hook-form"
import { countryQueryKeys } from "../../country/services/keys"
import FormSelectField from "../../../../components/Forms/FormReactSelect"

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
    control,
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

  // Query
  const {
    data: countriesData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CountryLookupResponse[], Error>({
    queryKey: countryQueryKeys.lookups(),
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
        {...register("name", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "name")}
      />

      <InputFieldWithError
        label="Локальна назва"
        {...register("nameLocal", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "nameLocal")}
      />

      <Controller
        name="countryId"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            isClearable={true}
            fieldState={fieldState}
            options={countriesOptions}
            placeholder="Оберіть країну"
            errorMessage={getNestedErrorMessage(errors, "countryId")}
          />
        )}
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

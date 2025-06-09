import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  ReactSelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import { logger } from "../../../../utils/logger"
import { citySchema, type CityFormFields } from "./schema"
import { formTransformers } from "../../../../utils/formTransformers"
import AlertMessage, { AlertType } from "../../../../components/AlertMessage"
import { useQuery } from "@tanstack/react-query"
import type { CountryLookupResponse } from "../../country/types/response.dto"
import { countryService } from "../../country/services/service"
import type { Option } from "../../../../components/Select/ReactSelect"

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
        errorMessage={errors.name?.message}
        {...register("name", formTransformers.string)}
      />

      <InputFieldWithError
        label="Локальна назва"
        errorMessage={errors.nameLocal?.message}
        {...register("nameLocal", formTransformers.string)}
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

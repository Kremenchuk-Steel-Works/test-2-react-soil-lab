import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  ReactSelectWithError,
  ReactSelectMultiWithError,
  FileUploadWithError,
} from "../../../../components/WithError/fieldsWithError"
import { ContactForm } from "../../contact/forms/form"
import { AddressForm } from "../../address/forms/form"
import { DynamicFieldArray } from "../../../../components/Forms/DynamicFieldArray"
import { EmployeeProfileForm } from "../../employeeProfile/forms/form"
import { OptionalField } from "../../../../components/Forms/OptionalField"
import { genderOptions } from "../types/gender"
import AlertMessage, { AlertType } from "../../../../components/AlertMessage"
import { useQueries, type UseQueryResult } from "@tanstack/react-query"
import { organizationsService } from "../../organizations/services/service"
import { positionsService } from "../../positions/services/service"
import type { OrganizationLookupResponse } from "../../organizations/types/response.dto"
import type { PositionLookupResponse } from "../../positions/types/response.dto"
import FormDateField from "../../../../components/Forms/FormDateField"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../lib/react-hook-form"
import { logger } from "../../../../lib/logger"
import { peopleSchema, type PeopleFormFields } from "./schema"

type FormFields = PeopleFormFields
const schema = peopleSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function PeopleForm({
  defaultValues,
  onSubmit,
  submitBtnName,
}: FormProps) {
  const {
    control,
    register,
    resetField,
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

  // Queries
  const queries = useQueries({
    queries: [
      {
        queryKey: ["organizationLookup"],
        queryFn: () => organizationsService.getLookup(),
      },
      {
        queryKey: ["positionLookup"],
        queryFn: () => positionsService.getLookup(),
      },
    ],
  })

  // Loading || Error
  const isAnyLoading = queries.some((q) => q.isLoading)
  const isAnyError = queries.some((q) => q.isError)
  const firstError = queries.find((q) => q.error)?.error

  if (isAnyLoading) return
  if (isAnyError && firstError instanceof Error) {
    return <AlertMessage type={AlertType.ERROR} message={firstError.message} />
  }

  // Queries data
  const [organizationsQ, positionsQ] = queries as [
    UseQueryResult<OrganizationLookupResponse[], Error>,
    UseQueryResult<PositionLookupResponse[], Error>
  ]

  // Options
  const organizationsOptions =
    organizationsQ.data?.map((c) => ({
      value: c.id,
      label: c.legalName,
    })) || []

  const positionsOptions =
    positionsQ.data?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Ім'я"
        {...register("firstName", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "firstName")}
      />

      <InputFieldWithError
        label="Прізвище"
        {...register("lastName", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "lastName")}
      />

      <InputFieldWithError
        label="По батькові"
        {...register("middleName", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "middleName")}
      />

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть стать"
            isClearable={true}
            options={genderOptions}
            value={genderOptions.find((opt) => opt.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={getNestedErrorMessage(errors, "gender")}
          />
        )}
      />

      <Controller
        name="birthDate"
        control={control}
        render={({ field, fieldState }) => (
          <FormDateField
            field={field}
            fieldState={fieldState}
            minDate={new Date("1800-01-01")}
            label="Дата народження"
            errorMessage={getNestedErrorMessage(errors, "birthDate")}
          />
        )}
      />

      <InputFieldWithError
        label="Посилання на фото"
        type="url"
        {...register("photoUrl", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "photoUrl")}
      />

      <Controller
        name="photoUrl"
        control={control}
        render={({ field }) => (
          <>
            {field.value && (
              <div className="mb-2">
                <img
                  src={URL.createObjectURL(field.value)}
                  alt="Preview"
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
            )}
            <FileUploadWithError
              multiple={false}
              onFilesAccepted={(files) => {
                if (files.length > 0) {
                  field.onChange(files[0])
                }
              }}
              accept={{
                "image/png": [".png"],
                "image/jpeg": [".jpg", ".jpeg"],
              }}
              maxSize={5 * 1024 * 1024}
              errorMessage={getNestedErrorMessage(errors, "photoUrl")}
            />
          </>
        )}
      />

      {/* Contacts */}
      <DynamicFieldArray
        label="контактні дані"
        name="contacts"
        form={ContactForm<PeopleFormFields>}
        defaultItem={{
          value: undefined!,
          type: undefined!,
          isPrimary: undefined!,
        }}
        control={control}
        register={register}
        errors={errors}
      />

      {/* Address */}
      <DynamicFieldArray
        label="адресу"
        name="addresses"
        form={AddressForm<PeopleFormFields>}
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

      <Controller
        name="organizationIds"
        control={control}
        render={({ field }) => (
          <ReactSelectMultiWithError
            placeholder="Оберіть організацію"
            isMulti={true}
            isClearable={true}
            options={organizationsOptions}
            value={organizationsOptions.filter((opt) =>
              field.value?.includes(opt.value)
            )}
            onChange={(selectedOptions) =>
              field.onChange(selectedOptions?.map((opt) => opt.value) || [])
            }
            errorMessage={getNestedErrorMessage(errors, "organizationIds")}
          />
        )}
      />

      <Controller
        name="positionIds"
        control={control}
        render={({ field }) => (
          <ReactSelectMultiWithError
            placeholder="Оберіть посаду"
            isMulti={true}
            isClearable={true}
            options={positionsOptions}
            value={positionsOptions.filter((opt) =>
              field.value?.includes(opt.value)
            )}
            onChange={(selectedOptions) =>
              field.onChange(selectedOptions?.map((opt) => opt.value) || [])
            }
            errorMessage={getNestedErrorMessage(errors, "positionIds")}
          />
        )}
      />

      <OptionalField
        label="профіль працівника"
        name="employeeProfile"
        form={EmployeeProfileForm<PeopleFormFields>}
        control={control}
        register={register}
        errors={errors}
        resetField={resetField}
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

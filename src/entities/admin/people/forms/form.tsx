import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
} from "../../../../shared/ui/with-error/fieldsWithError"
import { ContactForm } from "../../contact/forms/form"
import { AddressForm } from "../../address/forms/form"
import { DynamicFieldArray } from "../../../../shared/ui/forms123/DynamicFieldArray"
import { EmployeeProfileForm } from "../../employeeProfile/forms/form"
import { OptionalField } from "../../../../shared/ui/forms123/OptionalField"
import { genderOptions } from "../types/gender"
import AlertMessage, {
  AlertType,
} from "../../../../shared/ui/alert-message/AlertMessage"
import { useQueries, type UseQueryResult } from "@tanstack/react-query"
import { organizationService } from "../../organizations/services/service"
import { positionService } from "../../positions/services/service"
import type { OrganizationLookupResponse } from "../../organizations/types/response.dto"
import type { PositionLookupResponse } from "../../positions/types/response.dto"
import FormDateField from "../../../../shared/ui/forms123/FormDateField"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../shared/lib/react-hook-form"
import { logger } from "../../../../shared/lib/logger"
import { peopleSchema, type PeopleFormFields } from "./schema"
import FormFileUpload from "../../../../shared/ui/forms123/FormFileUpload"
import type { Option } from "../../../../shared/ui/select123/ReactSelect"
import FormSelectField from "../../../../shared/ui/forms123/FormReactSelect"
import { organizationQueryKeys } from "../../organizations/services/keys"
import { positionQueryKeys } from "../../positions/services/keys"

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
    setValue,
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
        queryKey: organizationQueryKeys.lookups(),
        queryFn: () => organizationService.getLookup(),
      },
      {
        queryKey: positionQueryKeys.lookups(),
        queryFn: () => positionService.getLookup(),
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
  const organizationsOptions: Option<string>[] =
    organizationsQ.data?.map((c) => ({
      value: c.id,
      label: c.legalName,
    })) || []

  const positionsOptions: Option<string>[] =
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
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={genderOptions}
            isVirtualized
            isClearable
            placeholder="Оберіть стать"
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

      <Controller
        name="photoUrl"
        control={control}
        render={({ field, fieldState }) => (
          <FormFileUpload
            field={field}
            fieldState={fieldState}
            label="Фото профілю"
            fileType="image"
            errorMessage={getNestedErrorMessage(errors, "photoUrl")}
          />
        )}
      />

      {/* Contacts */}
      <DynamicFieldArray
        label="контактні дані"
        name="contacts"
        form={ContactForm}
        defaultItem={undefined!}
        control={control}
        register={register}
        errors={errors}
      />

      {/* Address */}
      <DynamicFieldArray
        label="адресу"
        name="addresses"
        form={AddressForm}
        defaultItem={undefined!}
        control={control}
        register={register}
        errors={errors}
      />

      <Controller
        name="organizationIds"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={organizationsOptions}
            isVirtualized
            isMulti
            isClearable
            placeholder="Оберіть організацію"
            errorMessage={getNestedErrorMessage(errors, "organizationIds")}
          />
        )}
      />

      <Controller
        name="positionIds"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={positionsOptions}
            isVirtualized
            isMulti
            isClearable
            placeholder="Оберіть посаду"
            errorMessage={getNestedErrorMessage(errors, "positionIds")}
          />
        )}
      />

      <OptionalField
        label="профіль працівника"
        name="employeeProfile"
        form={EmployeeProfileForm}
        control={control}
        register={register}
        errors={errors}
        resetField={resetField}
        setValue={setValue}
        defaultItem={{}}
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

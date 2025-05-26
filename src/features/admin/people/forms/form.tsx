import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  peopleEmployeeProfileSchema,
  peopleSchema,
  type PeopleFormFields,
} from "./schema"
import {
  InputFieldWithError,
  ButtonWithError,
  SelectWithError,
  ReactSelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import { logger } from "../../../../utils/logger"

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

  // const customClassNames = {
  //   control: ({ isFocused }: { isFocused?: boolean }) =>
  //     isFocused
  //       ? "border-red-500 ring-red-300"
  //       : "border-red-300 dark:border-red-600",
  //   option: ({ isSelected }: { isSelected?: boolean }) =>
  //     isSelected ? "bg-red-500 text-white" : "hover:bg-red-100",
  // }
  const genderOptions = [
    ...peopleSchema.shape.gender.options.map((value) => ({
      value,
      label:
        value === "male" ? "Чоловіча" : value === "female" ? "Жіноча" : "Інша",
    })),
  ]

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Ім'я"
        errorMessage={errors.firstName?.message}
        {...register("firstName")}
      />

      <InputFieldWithError
        label="Прізвище"
        errorMessage={errors.lastName?.message}
        {...register("lastName")}
      />

      <InputFieldWithError
        label="По батькові"
        errorMessage={errors.middleName?.message}
        {...register("middleName")}
      />

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <SelectWithError
            className="w-full"
            heightClass="py-3.5"
            placeholder="Оберіть стать"
            isClearable={true}
            options={[
              ...peopleSchema.shape.gender.options.map((value) => ({
                value,
                label:
                  value === "male"
                    ? "Чоловіча"
                    : value === "female"
                    ? "Жіноча"
                    : "Інша",
              })),
            ]}
            value={field.value}
            onChange={field.onChange}
            errorMessage={errors.gender?.message}
          />
        )}
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
            errorMessage={errors.gender?.message}
          />
        )}
      />

      <InputFieldWithError
        label="Дата народження"
        type="date"
        errorMessage={errors.birthDate?.message}
        {...register("birthDate")}
      />

      <InputFieldWithError
        label="Посилання на фото"
        type="url"
        errorMessage={errors.photoUrl?.message}
        {...register("photoUrl")}
      />

      <InputFieldWithError
        label="Email"
        type="email"
        errorMessage={errors.email?.message}
        {...register("email")}
      />

      <InputFieldWithError
        label="Телефонний номер"
        errorMessage={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />

      <div className="space-y-3">
        <h4 className="layout-text">Організація</h4>

        <InputFieldWithError
          label="Організація ID"
          errorMessage={errors.organizations?.organizationId?.message}
          {...register("organizations.organizationId")}
        />
      </div>

      <div className="space-y-3">
        <h4 className="layout-text">Посада</h4>

        <InputFieldWithError
          label="Посада ID"
          errorMessage={errors.positions?.positionId?.message}
          {...register("positions.positionId")}
        />
      </div>

      <div className="space-y-3">
        <h4 className="layout-text">Профіль робітника</h4>

        <InputFieldWithError
          label="Номер робітника"
          type="number"
          errorMessage={errors.employeeProfiles?.employeeNumber?.message}
          {...register("employeeProfiles.employeeNumber")}
        />

        <InputFieldWithError
          label="Дата найму"
          type="date"
          errorMessage={errors.employeeProfiles?.hiredAt?.message}
          {...register("employeeProfiles.hiredAt")}
        />

        <Controller
          name="employeeProfiles.employmentStatus"
          control={control}
          render={({ field }) => (
            <SelectWithError
              className="w-full"
              heightClass="py-3.5"
              placeholder="Оберіть статус працевлаштування"
              isClearable={true}
              options={[
                ...peopleEmployeeProfileSchema.shape.employmentStatus.options.map(
                  (value) => ({
                    value,
                    label:
                      value === "employed"
                        ? "Працює"
                        : value === "on_leave"
                        ? "У відпустці"
                        : value === "on_maternity"
                        ? "У декреті"
                        : value === "terminated"
                        ? "Звільнений"
                        : value === "probation"
                        ? "Випробувальний термін"
                        : value === "inactive"
                        ? "Неактивний"
                        : "Невідомо",
                  })
                ),
              ]}
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.employeeProfiles?.employmentStatus?.message}
            />
          )}
        />
      </div>

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

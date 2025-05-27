import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  contactSchema,
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
      label: (() => {
        switch (value) {
          case "male":
            return "Чоловіча"
          case "female":
            return "Жіноча"
          case "other":
            return "Інша"
          default:
            return "Невідомо"
        }
      })(),
    })),
  ]

  const contactOptions = [
    ...contactSchema.shape.type.options.map((value) => ({
      value,
      label: (() => {
        switch (value) {
          case "email":
            return "Email"
          case "phone":
            return "Телефон"
          case "telegram":
            return "Телеграм"
          case "linkedin":
            return "Linkedin"
          case "website":
            return "Сайт"
          default:
            return "Невідомо"
        }
      })(),
    })),
  ]

  const employmentStatusOptions = [
    ...peopleEmployeeProfileSchema.shape.employmentStatus.options.map(
      (value) => ({
        value,
        label: (() => {
          switch (value) {
            case "intern":
              return "Стажер"
            case "full-time":
              return "Повна зайнятість"
            case "part-time":
              return "Неповна зайнятість"
            case "contract":
              return "Контракт"
            case "on-leave":
              return "У відпустці"
            case "suspended":
              return "Призупинено"
            case "terminated":
              return "Звільнений"
            case "retired":
              return "На пенсії"
            default:
              return "Невідомо"
          }
        })(),
      })
    ),
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

      {/* <Controller
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
      /> */}

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

      <div className="space-y-3">
        <h4 className="layout-text">Контакти</h4>

        <InputFieldWithError
          label="isPrimary"
          errorMessage={errors.contacts?.isPrimary?.message}
          {...register("contacts.isPrimary")}
        />

        <Controller
          name="contacts.type"
          control={control}
          render={({ field }) => (
            <ReactSelectWithError
              placeholder="Оберіть тип"
              isClearable={true}
              options={contactOptions}
              value={contactOptions.find((opt) => opt.value === field.value)}
              onChange={(option) => field.onChange(option?.value)}
              errorMessage={
                errors.contacts?.type &&
                typeof errors.contacts.type === "object" &&
                "message" in errors.contacts.type
                  ? errors.contacts.type.message
                  : undefined
              }
            />
          )}
        />

        <InputFieldWithError
          label="Value"
          errorMessage={errors.contacts?.value?.message}
          {...register("contacts.value")}
        />

        <InputFieldWithError
          label="Note"
          errorMessage={errors.contacts?.note?.message}
          {...register("contacts.note")}
        />
      </div>

      <div className="space-y-3">
        <h4 className="layout-text">Адреса</h4>

        <InputFieldWithError
          label="Номер робітника"
          type="number"
          errorMessage={errors.employeeProfiles?.employeeNumber?.message}
          {...register("employeeProfiles.employeeNumber")}
        />
      </div>

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
              options={employmentStatusOptions}
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

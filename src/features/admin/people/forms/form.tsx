import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { peopleSchema, type PeopleFormFields } from "./schema"
import {
  InputFieldWithError,
  ButtonWithError,
  ReactSelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import { logger } from "../../../../utils/logger"
import { ContactForm } from "../../contact/forms/form"
import { AddressForm } from "../../address/forms/form"
import { EmployeeProfileForm } from "../../employeeProfile/forms/form"

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

      <ContactForm<PeopleFormFields>
        control={control}
        register={register}
        errors={errors}
      />

      <AddressForm<PeopleFormFields>
        control={control}
        register={register}
        errors={errors}
      />

      <div className="space-y-3">
        <h4 className="layout-text">Організація</h4>

        <InputFieldWithError
          label="Організація ID"
          {...register(`organizations.${0}.organizationId`)}
          errorMessage={errors.organizations?.[0]?.organizationId?.message}
        />
      </div>

      <div className="space-y-3">
        <h4 className="layout-text">Посада</h4>

        <InputFieldWithError
          label="Посада ID"
          {...register(`positions.${0}.positionId`)}
          errorMessage={errors.positions?.[0]?.positionId?.message}
        />
      </div>

      <EmployeeProfileForm<PeopleFormFields>
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

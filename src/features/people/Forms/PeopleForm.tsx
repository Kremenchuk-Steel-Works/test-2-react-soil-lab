import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { z, ZodSchema } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import log from "../../../utils/logger"
import { peopleSchema } from "./schema"
import {
  InputFieldWithError,
  ButtonWithError,
  SelectWithError,
} from "../../../components/WithError/fieldsWithError"

export type PeopleFormFields = z.infer<typeof peopleSchema>

interface UserFormProps {
  defaultValues?: Partial<PeopleFormFields>
  onSubmit: SubmitHandler<PeopleFormFields>
  submitBtnName: string
  schema: ZodSchema
}

export default function PeopleForm({
  defaultValues,
  onSubmit,
  submitBtnName,
  schema,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PeopleFormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const submitHandler: SubmitHandler<PeopleFormFields> = async (data) => {
    try {
      const response = await onSubmit(data)
      log.debug("Форма успешно выполнена", response)
    } catch (err) {
      const error = err as Error
      setError("root", { message: error.message })
      log.error(err)
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Ім'я"
        errorMessage={errors.firstName?.message}
        {...register("firstName")}
      />

      <InputFieldWithError
        label="Прізвище"
        errorMessage={(errors as any).lastName?.message}
        {...register("lastName" as any)}
      />

      <InputFieldWithError
        label="По батькові"
        errorMessage={(errors as any).middleName?.message}
        {...register("middleName" as any)}
      />

      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <SelectWithError
            className="w-full"
            heightClass="py-3.5"
            placeholder="Оберіть стать"
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
            errorMessage={(errors as any).gender?.message}
          />
        )}
      />

      <InputFieldWithError
        label="Дата народження"
        type="date"
        errorMessage={(errors as any).birthDate?.message}
        {...register("birthDate" as any)}
      />

      <InputFieldWithError
        label="Посилання на фото"
        type="url"
        errorMessage={(errors as any).photoUrl?.message}
        {...register("photoUrl" as any)}
      />

      <InputFieldWithError
        label="Email"
        type="email"
        errorMessage={(errors as any).email?.message}
        {...register("email" as any)}
      />

      <InputFieldWithError
        label="Телефонний номер"
        errorMessage={(errors as any).phoneNumber?.message}
        {...register("phoneNumber" as any)}
      />

      <div className="space-y-3">
        <h4 className="layout-text">Профіль робітника</h4>

        <InputFieldWithError
          label="Номер робітника"
          type="number"
          errorMessage={
            (errors as any).employeeProfiles?.employeeNumber?.message
          }
          {...register("employeeProfiles.employeeNumber" as any)}
        />

        <InputFieldWithError
          label="Дата найму"
          type="date"
          errorMessage={(errors as any).employeeProfiles?.hiredAt?.message}
          {...register("employeeProfiles.hiredAt" as any)}
        />

        <InputFieldWithError
          label="Статус"
          errorMessage={
            (errors as any).employeeProfiles?.employmentStatus?.message
          }
          {...register("employeeProfiles.employmentStatus" as any)}
        />

        <Controller
          name="employeeProfiles.employmentStatus"
          defaultValue={undefined}
          control={control}
          render={({ field }) => (
            <SelectWithError
              className="w-full"
              heightClass="py-3.5"
              placeholder="Оберіть статус"
              options={[
                ...peopleSchema.shape.gender.options.map((value) => ({
                  value,
                  label: value,
                })),
              ]}
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.employeeProfiles?.employmentStatus?.message}
            />
          )}
        />
      </div>

      <div className="space-y-3">
        <h4 className="layout-text">Організація</h4>

        <InputFieldWithError
          label="Організація ID"
          errorMessage={(errors as any).organizations?.organizationId?.message}
          {...register("organizations.organizationId" as any)}
        />
      </div>

      <div className="space-y-3">
        <h4 className="layout-text">Посада</h4>

        <InputFieldWithError
          label="Посада ID"
          errorMessage={(errors as any).positions?.positionId?.message}
          {...register("positions.positionId" as any)}
        />
      </div>

      <ButtonWithError
        className="w-full"
        type="submit"
        errorMessage={(errors as any).root?.message}
        disabled={isSubmitting}
      >
        {submitBtnName}
      </ButtonWithError>
    </form>
  )
}

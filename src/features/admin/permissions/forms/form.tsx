import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  ReactSelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import { permissionsSchema, type PermissionsFormFields } from "./schema"
import { mockDepartments } from "../../departments/mocks/mock"
import { logger } from "../../../../lib/logger"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../lib/react-hook-form"

type FormFields = PermissionsFormFields
const schema = permissionsSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function PermissionsForm({
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

  const departmentsData = mockDepartments
  const departmentsDataOptions = [
    ...departmentsData.map((obj) => ({
      value: obj.id,
      label: obj.name,
    })),
  ]

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
      <InputFieldWithError
        label="Назва"
        {...register("name", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "name")}
      />

      <InputFieldWithError
        label="Опис"
        {...register("description", formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, "description")}
      />

      <Controller
        name="departmentId"
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть відділ"
            isClearable={true}
            onChange={(option) => field.onChange(option?.value)}
            options={departmentsDataOptions}
            value={departmentsDataOptions.find(
              (opt) => opt.value === field.value
            )}
            errorMessage={getNestedErrorMessage(errors, "departmentId")}
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

import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InputFieldWithError,
  ButtonWithError,
  ReactSelectMultiWithError,
} from "../../../../components/WithError/fieldsWithError"
import { rolesSchema, type RolesFormFields } from "./schema"
import { mockPermissions } from "../../permissions/mocks/mock"
import { logger } from "../../../../lib/logger"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../lib/react-hook-form"

type FormFields = RolesFormFields
const schema = rolesSchema

interface FormProps {
  defaultValues?: Partial<FormFields>
  onSubmit: SubmitHandler<FormFields>
  submitBtnName: string
}

export default function RolesForm({
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

  const permissionsData = mockPermissions
  const permissionsOptions = [
    ...permissionsData.map((obj) => ({
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
        name="permissionIds"
        control={control}
        render={({ field }) => (
          <ReactSelectMultiWithError
            placeholder="Оберіть права доступу"
            isMulti={true}
            isClearable={true}
            options={permissionsOptions}
            value={permissionsOptions.filter((opt) =>
              field.value?.includes(opt.value)
            )}
            onChange={(selectedOptions) =>
              field.onChange(selectedOptions?.map((opt) => opt.value) || [])
            }
            errorMessage={getNestedErrorMessage(errors, "permissionIds")}
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

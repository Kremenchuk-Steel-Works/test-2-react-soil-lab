import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  MoldPassportCreateForm,
  moldPassportCreateFormDefaultValues,
  useMoldPassportService,
  type MoldPassportCreateFormFields,
} from '@/entities/soil-lab/mold-passport'
import { getGetMoldPassportsListApiV1MoldPassportsGetQueryKey } from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'

export default function MoldPassportCreate() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutateAsync } = useMoldPassportService.create({
    mutation: {
      onSuccess: () => {
        return queryClient.invalidateQueries({
          queryKey: getGetMoldPassportsListApiV1MoldPassportsGetQueryKey(),
        })
      },
    },
  })

  const handleSubmit = async (data: MoldPassportCreateFormFields) => {
    await mutateAsync({ data })
    navigate('..')
    return data
  }

  return (
    <MoldPassportCreateForm
      defaultValues={moldPassportCreateFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Додати"
    />
  )
}

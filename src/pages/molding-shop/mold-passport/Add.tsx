import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  MoldPassportForm,
  moldPassportFormDefaultValues,
  useMoldPassportService,
  type MoldPassportFormFields,
} from '@/entities/molding-shop/mold-passport'
import { getGetMoldPassportsListApiV1MoldPassportsGetQueryKey } from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'

export default function MoldPassportAdd() {
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

  const handleSubmit = async (data: MoldPassportFormFields) => {
    await mutateAsync({ data })
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldPassportForm
            defaultValues={moldPassportFormDefaultValues}
            onSubmit={handleSubmit}
            submitBtnName="Додати"
          />
        </div>
      </div>
    </>
  )
}

import { useQueryClient } from '@tanstack/react-query'
import { moldPassportService } from '@/entities/molding-shop-update/mold-passport'
import {
  moldPassportCreateFormDefaultValues,
  type MoldPassportCreateFormFields,
} from '@/features/molding-shop-update/mold-passport/create/model/schema'
import { MoldPassportCreateForm } from '@/features/molding-shop-update/mold-passport/create/ui/MoldPassportCreateForm'
import { getGetMoldPassportsListApiV1MoldPassportsGetQueryKey } from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'

interface MoldPassportCreateProps {
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function MoldPassportCreate({ onSuccess, onError }: MoldPassportCreateProps) {
  const queryClient = useQueryClient()

  const { mutateAsync } = moldPassportService.create({
    mutation: {
      onSuccess: (res) => {
        void queryClient.invalidateQueries({
          queryKey: getGetMoldPassportsListApiV1MoldPassportsGetQueryKey(),
        })
        onSuccess?.(res)
      },
      onError: (err) => onError?.(err),
    },
  })

  const handleSubmit = async (data: MoldPassportCreateFormFields) => {
    await mutateAsync({ data })
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

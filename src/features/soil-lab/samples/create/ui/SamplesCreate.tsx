import { useQueryClient } from '@tanstack/react-query'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import {
  samplesCreateFormDefaultValues,
  type SamplesCreateFormFields,
} from '@/features/soil-lab/samples/create/model/schema'
import { SamplesCreateForm } from '@/features/soil-lab/samples/create/ui/SamplesCreateForm'
import { getGetSamplesListApiV1SamplesGetQueryKey } from '@/shared/api/soil-lab-2/endpoints/samples/samples'

interface SamplesCreateProps {
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function SamplesCreate({ onSuccess, onError }: SamplesCreateProps) {
  const queryClient = useQueryClient()

  const { mutateAsync } = samplesService.create({
    mutation: {
      onSuccess: (res) => {
        void queryClient.invalidateQueries({
          queryKey: getGetSamplesListApiV1SamplesGetQueryKey(),
        })
        onSuccess?.(res)
      },
      onError: (err) => onError?.(err),
    },
  })

  const handleSubmit = async (data: SamplesCreateFormFields) => {
    await mutateAsync({ data })
    return data
  }

  return (
    <SamplesCreateForm
      defaultValues={samplesCreateFormDefaultValues}
      onSubmit={handleSubmit}
      submitBtnName="Додати"
    />
  )
}

import { useQueryClient } from '@tanstack/react-query'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import {
  getGetSampleApiV1SamplesSampleIdGetQueryKey,
  getGetSamplesListApiV1SamplesGetQueryKey,
} from '@/shared/api/soil-lab-2/endpoints/samples/samples'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

interface SamplesDeleteProps {
  id: string
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function SamplesDelete({ id, onSuccess, onError }: SamplesDeleteProps) {
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending,
    error: mutationError,
  } = samplesService.delete({
    mutation: {
      onSuccess: (res, variables) => {
        const queryKeyList = getGetSamplesListApiV1SamplesGetQueryKey()
        const queryKeyDetail = getGetSampleApiV1SamplesSampleIdGetQueryKey(variables.sampleId)

        return Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeyList }),
          queryClient.invalidateQueries({ queryKey: queryKeyDetail }),
        ]).finally(() => {
          onSuccess?.(res)
        })
      },
      onError: (err) => onError?.(err),
    },
  })

  // Запрос на удаление
  const handleSubmit = () => {
    if (!id || isPending) return
    mutate({ sampleId: id })
  }

  return (
    <>
      <h5 className="layout-text">Ви впевнені, що хочете видалити?</h5>

      <div>
        <ConfiguredButton btnType="delete" onClick={handleSubmit} disabled={isPending} />
      </div>

      {mutationError && (
        <AlertMessage type={AlertType.ERROR} message={getErrorMessage(mutationError)} />
      )}
    </>
  )
}

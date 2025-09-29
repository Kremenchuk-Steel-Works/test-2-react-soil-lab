import { useQueryClient } from '@tanstack/react-query'
import { testsService } from '@/entities/soil-lab/tests/api/service'
import {
  getGetTestApiV1TestsTestIdGetQueryKey,
  getGetTestsListApiV1TestsGetQueryKey,
} from '@/shared/api/soil-lab/endpoints/tests/tests'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

interface TestsDeleteProps {
  id: string
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

export default function TestsDelete({ id, onSuccess, onError }: TestsDeleteProps) {
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending,
    error: mutationError,
  } = testsService.delete({
    mutation: {
      onSuccess: (res, variables) => {
        const queryKeyList = getGetTestsListApiV1TestsGetQueryKey()
        const queryKeyDetail = getGetTestApiV1TestsTestIdGetQueryKey(variables.testId)

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
    mutate({ testId: id })
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

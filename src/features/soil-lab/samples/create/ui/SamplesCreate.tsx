import { useQueryClient } from '@tanstack/react-query'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import type { SamplesCreateOptions } from '@/entities/soil-lab/samples/ui/form/fields'
import {
  samplesCreateFormDefaultValues,
  type SamplesCreateFormFields,
} from '@/features/soil-lab/samples/create/model/schema'
import { SamplesCreateForm } from '@/features/soil-lab/samples/create/ui/SamplesCreateForm'
import {
  getGetSamplesListApiV1SamplesGetQueryKey,
  type CreateSampleApiV1SamplesPostMutationResult,
} from '@/shared/api/soil-lab/endpoints/samples/samples'
import { CachedForm, type CacheConfig } from '@/shared/ui/react-hook-form/cached-form/CachedForm'

type SamplesCreateProps = {
  onSuccess?: (res: CreateSampleApiV1SamplesPostMutationResult) => void
  onError?: (err: unknown) => void
} & SamplesCreateOptions

const { moldingSandRecipe } = samplesFieldRegistry

const cacheConfig: CacheConfig<SamplesCreateFormFields> = {
  enabled: true,
  cacheKey: 'soil-lab:samples:create',
  fieldsToCache: [moldingSandRecipe.key],
  ttl: 16 * 60 * 60 * 1000,
}

export default function SamplesCreate({ onSuccess, onError, options }: SamplesCreateProps) {
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
    <CachedForm
      cacheConfig={cacheConfig}
      initialData={samplesCreateFormDefaultValues}
      onSubmit={handleSubmit}
    >
      {({ defaultValues, onSubmit }) => (
        <SamplesCreateForm
          defaultValues={defaultValues}
          options={options}
          onSubmit={onSubmit}
          submitBtnName="Додати"
        />
      )}
    </CachedForm>
  )
}

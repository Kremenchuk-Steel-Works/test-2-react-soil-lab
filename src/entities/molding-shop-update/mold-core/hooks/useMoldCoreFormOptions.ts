import { coreBatchService } from '@/entities/molding-shop/core-batch'
import type {
  MoldCoreBatchLookupResponse,
  MoldCoreDetailResponse,
} from '@/shared/api/mold-passport/model'
import { useAsyncOptions } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'

const formatCoreBatchLabel = (d: MoldCoreBatchLookupResponse) =>
  `${d.moldingSandType.name} ${d.moldCoreType.modelNumber} ${d.moldCoreMakingMachine.brand} ${d.moldCoreMakingMachine.model} ${d.manufacturingTimestamp} ${d.batchExpiryDate}`

export function useMoldCoreFormOptions(responseData?: MoldCoreDetailResponse | null) {
  const loadCoreBatches = useAsyncOptions(coreBatchService.getLookup, {
    paramsBuilder: (search, page) => ({
      search,
      page,
      pageSize: 20,
    }),
    responseAdapter: (data) => ({
      items: data.data,
      hasMore: data.data.length < data.totalItems,
    }),
    mapper: (item) => ({
      value: item.id,
      label: formatCoreBatchLabel(item),
    }),
  })

  const defaultCoreBatches = useDefaultOption(responseData?.coreBatch, (d) => ({
    value: d.id,
    label: formatCoreBatchLabel(d),
  }))

  return {
    loadCoreBatches,
    defaultCoreBatches,
  }
}

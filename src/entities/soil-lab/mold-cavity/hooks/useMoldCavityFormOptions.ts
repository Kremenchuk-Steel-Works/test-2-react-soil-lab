import { castingPatternService } from '@/entities/soil-lab/casting-pattern'
import type { MoldCavityDetailResponse } from '@/shared/api/mold-passport/model'
import { useAsyncOptions } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'

export function useMoldCavityFormOptions(responseData?: MoldCavityDetailResponse | null) {
  const loadCastingPatterns = useAsyncOptions(castingPatternService.getLookup, {
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
      label: item.serialNumber,
    }),
  })

  const defaultCastingPatterns = useDefaultOption(responseData?.castingPattern, (d) => ({
    value: d.id,
    label: d.serialNumber,
  }))

  return {
    loadCastingPatterns,
    defaultCastingPatterns,
  }
}

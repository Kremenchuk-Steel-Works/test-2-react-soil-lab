import { materialsService } from '@/entities/soil-lab/materials/api/service'
import { materialSourcesService } from '@/entities/soil-lab/materialSources/api/service'
import type { SampleDetailResponse } from '@/shared/api/soil-lab/model'
import { useAsyncOptions } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'

export function useSamplesFormOptions(responseData?: SampleDetailResponse | null) {
  const loadMaterials = useAsyncOptions(materialsService.getLookup, {
    paramsBuilder: (search, page) => ({
      search,
      page,
      per_page: 20,
    }),
    responseAdapter: (data) => ({
      items: data.data,
      hasMore: data.page < data.totalPages,
    }),
    mapper: (item) => ({
      value: item.id,
      label: item.name,
    }),
  })

  const defaultMaterials = useDefaultOption(responseData?.material, (data) => ({
    value: data.id,
    label: data.name,
  }))

  const loadMaterialSources = useAsyncOptions(materialSourcesService.getLookup, {
    paramsBuilder: (search, page) => ({
      search,
      page,
      per_page: 20,
    }),
    responseAdapter: (data) => ({
      items: data.data,
      hasMore: data.page < data.totalPages,
    }),
    mapper: (item) => ({
      value: item.id,
      label: item.name,
    }),
  })

  const defaultMaterialSources = useDefaultOption(responseData?.materialSource, (data) => ({
    value: data.id,
    label: data.name,
  }))

  return {
    loadMaterials,
    defaultMaterials,
    loadMaterialSources,
    defaultMaterialSources,
  }
}

export type SamplesFormOptions = ReturnType<typeof useSamplesFormOptions>

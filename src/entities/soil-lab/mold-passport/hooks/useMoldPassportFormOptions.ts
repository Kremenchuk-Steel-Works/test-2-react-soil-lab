import { castingTechnologyService } from '@/entities/molding-shop/casting-technology'
import { resinService } from '@/entities/molding-shop/resin'
import { moldingAreaService } from '@/entities/soil-lab/molding-area'
import { moldingFlaskService } from '@/entities/soil-lab/molding-flask/api/service'
import { patternPlateFrameService } from '@/entities/soil-lab/pattern-plate-frame/api/service'
import type { MoldPassportDetailResponse } from '@/shared/api/mold-passport/model'
import { useAsyncOptions } from '@/shared/hooks/react-hook-form/options/useAsyncOptions'
import { useDefaultOption } from '@/shared/hooks/react-hook-form/options/useDefaultOption'

export function useMoldPassportFormOptions(responseData?: MoldPassportDetailResponse | null) {
  const loadMoldingAreas = useAsyncOptions(moldingAreaService.getLookup, {
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
      label: item.name,
    }),
  })

  const defaultMoldingAreas = useDefaultOption(responseData?.moldingArea, (data) => ({
    value: data.id,
    label: data.name,
  }))

  const loadPatternPlateFrames = useAsyncOptions(patternPlateFrameService.getLookup, {
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

  const defaultPatternPlateFrames = useDefaultOption(responseData?.patternPlateFrame, (data) => ({
    value: data.id,
    label: data.serialNumber,
  }))

  const loadMoldingFlasks = useAsyncOptions(moldingFlaskService.getLookup, {
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

  const defaultMoldingFlasks = useDefaultOption(responseData?.moldingFlask, (data) => ({
    value: data.id,
    label: data.serialNumber,
  }))

  const loadCastingTechnologies = useAsyncOptions(castingTechnologyService.getLookup, {
    paramsBuilder: (search, page) => ({
      search,
      page,
      pageSize: 20,
      // moldingAreaId: moldingAreaId,
    }),
    responseAdapter: (data) => ({
      items: data.data,
      hasMore: data.data.length < data.totalItems,
    }),
    mapper: (item) => ({
      value: item.id,
      label: item.name,
    }),
  })

  const defaultCastingTechnologies = useDefaultOption(responseData?.castingTechnology, (data) => ({
    value: data.id,
    label: data.name,
  }))

  const loadResins = useAsyncOptions(resinService.getLookup, {
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
      label: item.name,
    }),
  })

  const defaultResins = useDefaultOption(responseData?.dataAsc?.resin, (data) => ({
    value: data.id,
    label: data.name,
  }))

  return {
    loadMoldingAreas,
    defaultMoldingAreas,
    loadPatternPlateFrames,
    defaultPatternPlateFrames,
    loadMoldingFlasks,
    defaultMoldingFlasks,
    loadCastingTechnologies,
    defaultCastingTechnologies,
    loadResins,
    defaultResins,
  }
}

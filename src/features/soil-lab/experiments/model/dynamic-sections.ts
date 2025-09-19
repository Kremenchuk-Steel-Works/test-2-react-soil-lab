import { experimentsMoistureDynamicSections } from '@/entities/soil-lab/experiments/moisture/ui/form/lib/dynamic-sections'
import { experimentsStrengthDynamicSections } from '@/entities/soil-lab/experiments/strength/ui/form/lib/dynamic-sections'
import { mergeSections } from '@/shared/lib/zod/dynamic-sections-scoped'

export const experimentsAllDynamicSections = mergeSections(
  experimentsMoistureDynamicSections,
  experimentsStrengthDynamicSections,
)

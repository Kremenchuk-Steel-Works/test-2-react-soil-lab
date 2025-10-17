import { AFS_GRAIN_FINENESS_NUMBER_TRANSFORM } from '@/shared/lib/zod/unit-conversion/transforms/afsGrainFinenessNumber'
import { BULK_DENSITY_TRANSFORM } from '@/shared/lib/zod/unit-conversion/transforms/bulkDensity'
import { CLAY_CONTENT_TRANSFORM } from '@/shared/lib/zod/unit-conversion/transforms/clayContent'
import { COLLOIDALITY_PERCENT_TRANSFORM } from '@/shared/lib/zod/unit-conversion/transforms/colloidalityPercent'
import { COMPACTABILITY_PERCENT_TRANSFORM } from '@/shared/lib/zod/unit-conversion/transforms/compactabilityPercent'
import { FLOWABILITY_PERCENT_TRANSFORM } from '@/shared/lib/zod/unit-conversion/transforms/flowabilityPercentTransform'
import { PARTICLE_SIZE_DISTRIBUTION_TRANSFORM } from '@/shared/lib/zod/unit-conversion/transforms/particleSizeDistribution'
import { THERMAL_STABILITY_TRANSFORM } from '@/shared/lib/zod/unit-conversion/transforms/thermalStability'
import { WATER_ABSORPTION_TRANSFORM } from '@/shared/lib/zod/unit-conversion/transforms/waterAbsorption'
import type { TransformSpec } from '../transform-types'

export const Transforms = {
  PARTICLE_SIZE_DISTRIBUTION_TRANSFORM,
  CLAY_CONTENT_TRANSFORM,
  WATER_ABSORPTION_TRANSFORM,
  THERMAL_STABILITY_TRANSFORM,
  BULK_DENSITY_TRANSFORM,
  AFS_GRAIN_FINENESS_NUMBER_TRANSFORM,
  FLOWABILITY_PERCENT_TRANSFORM,
  COLLOIDALITY_PERCENT_TRANSFORM,
  COMPACTABILITY_PERCENT_TRANSFORM,
} as const satisfies Readonly<Record<string, TransformSpec<Record<string, number>>>>

/** Когда нужен список — делаем его из словаря */
export const ALL_TRANSFORMS = Object.values(Transforms) as ReadonlyArray<
  (typeof Transforms)[keyof typeof Transforms]
>

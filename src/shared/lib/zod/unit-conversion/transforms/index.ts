import type { TransformSpec } from '../transform-types'
import { CLAY_COMPONENT_OF_SAND_TRANSFORM } from './clayComponentOfSand'

export const Transforms = {
  CLAY_COMPONENT_OF_SAND_TRANSFORM,
} as const satisfies Readonly<Record<string, TransformSpec<Record<string, number>>>>

/** Когда нужен список — делаем его из словаря */
export const ALL_TRANSFORMS = Object.values(Transforms) as ReadonlyArray<
  (typeof Transforms)[keyof typeof Transforms]
>

import type { MixtureSubType } from '@/entities/mold-passport/mixtures/types/subType'
import type { MixtureType } from '@/entities/mold-passport/mixtures/types/type'

export interface MixtureBase {
  type: MixtureType
}

export interface MixtureScmBase extends MixtureBase {
  type: 'scm'
  subType: MixtureSubType
  mixtureNumber: string
}

export interface MixtureChmBase extends MixtureBase {
  type: 'chm'
}

export type Mixture = MixtureScmBase | MixtureChmBase

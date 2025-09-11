import {
  MIXTURES,
  type ExperimentTypeConfig,
} from '@/entities/soil-lab/experiments/types/experiments-config'

export const MOISTURE_CONFIG: ExperimentTypeConfig = {
  [MIXTURES[13]]: {
    norm: {
      moistureContentPercent: {
        byRange: [
          { when: (t) => t >= 18, range: { min: 2.6, max: 3.1 } },
          { when: (t) => t < 18, range: { min: 2.5, max: 3.0 } },
        ],
      },
    },
    round: { digits: 2 },
    differenceTreshold: { mode: 'absolute', value: 0.15 },
  },
  [MIXTURES[14]]: {
    norm: {
      moistureContentPercent: {
        byRange: [
          { when: (t) => t >= 18, range: { min: 3.4, max: 3.7 } },
          { when: (t) => t < 18, range: { min: 3.3, max: 3.5 } },
        ],
      },
    },
    round: { digits: 2 },
    differenceTreshold: { mode: 'absolute', value: 0.15 },
  },
  [MIXTURES[15]]: {
    norm: {
      moistureContentPercent: {
        byRange: [
          { when: (t) => t >= 18, range: { min: 2.6, max: 3.1 } },
          { when: (t) => t < 18, range: { min: 2.5, max: 3.1 } },
        ],
      },
    },
    round: { digits: 2 },
    differenceTreshold: { mode: 'absolute', value: 0.15 },
  },
}

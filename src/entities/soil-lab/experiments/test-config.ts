const MIXTURES = {
  '13': 13,
  '14': 14,
  '15': 15,
}

export const MIXTURES_CONFIG = {
  moisture: {
    [MIXTURES[13]]: {
      norm: {
        moistureContentPercent: {
          '>=18': {
            min: 2.6,
            max: 3.1,
          },
          '<18': {
            min: 2.5,
            max: 3.0,
          },
        },
      },
      round: { digits: 2 },
      differenceTreshold: { mode: 'absolute', value: 0.15 },
    },
    [MIXTURES[14]]: {
      norm: {
        moistureContentPercent: {
          '>=18': {
            min: 3.4,
            max: 3.7,
          },
          '< 18': {
            min: 3.3,
            max: 3.5,
          },
        },
      },
      round: { digits: 2 },
      differenceTreshold: { mode: 'absolute', value: 0.15 },
    },
    [MIXTURES[15]]: {
      norm: {
        moistureContentPercent: {
          '>=18': {
            min: 2.6,
            max: 3.1,
          },
          '< 18': {
            min: 2.5,
            max: 3.1,
          },
        },
      },
      round: { digits: 2 },
      differenceTreshold: { mode: 'absolute', value: 0.15 },
    },
  },
  permeability: {
    [MIXTURES[13]]: {
      norm: {
        min: 100,
      },
      differenceTreshold: { mode: 'relative', value: 10 },
    },
    [MIXTURES[14]]: {
      norm: {
        min: 100,
      },
      differenceTreshold: { mode: 'relative', value: 10 },
    },
    [MIXTURES[15]]: {
      norm: {
        min: 100,
      },
      differenceTreshold: { mode: 'relative', value: 10 },
    },
  },
  strength: {
    [MIXTURES[13]]: {
      norm: {
        min: 1.05,
        max: 1.2,
      },
      differenceTreshold: { mode: 'relative', value: 10 },
    },
    [MIXTURES[14]]: {
      norm: {
        min: 1.2,
        max: 1.3,
      },
      differenceTreshold: { mode: 'relative', value: 10 },
    },
    [MIXTURES[15]]: {
      norm: {
        min: 1.05,
        max: 1.2,
      },
      differenceTreshold: { mode: 'relative', value: 10 },
    },
  },
}

export const MOISTURE_CONFIG = {
  [MIXTURES[13]]: {
    norm: {
      moistureContentPercent: {
        '>=18': {
          min: 2.6,
          max: 3.1,
        },
        '<18': {
          min: 2.5,
          max: 3.0,
        },
      },
    },
    round: { digits: 2 },
    differenceTreshold: { mode: 'absolute', value: 0.15 },
  },
  [MIXTURES[14]]: {
    norm: {
      moistureContentPercent: {
        '>=18': {
          min: 3.4,
          max: 3.7,
        },
        '< 18': {
          min: 3.3,
          max: 3.5,
        },
      },
    },
    round: { digits: 2 },
    differenceTreshold: { mode: 'absolute', value: 0.15 },
  },
  [MIXTURES[15]]: {
    norm: {
      moistureContentPercent: {
        '>=18': {
          min: 2.6,
          max: 3.1,
        },
        '< 18': {
          min: 2.5,
          max: 3.1,
        },
      },
    },
    round: { digits: 2 },
    differenceTreshold: { mode: 'absolute', value: 0.15 },
  },
}

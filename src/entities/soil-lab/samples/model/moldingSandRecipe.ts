import { dictFromKeys, dictToOptions } from '@/utils/dict'

// Формувальні суміші
export const samplesMoldingSandRecipeMoldingMixturesLabels = {
  '13': '13 (Наповнювальна)',
  '14': '14 (Облицювальна)',
  '15': '15 (Для освіження)',
} as const

export const samplesMoldingSandRecipeMoldingMixturesOptions = dictToOptions(
  samplesMoldingSandRecipeMoldingMixturesLabels,
)

// Стрижневі суміші (CO2-процес)
export const samplesMoldingSandRecipeCoreMixturesCO2Labels = {
  '8': '8',
  '1C': '1С',
  '1XC': '1ХС',
  '1C1C': '1С1С',
  '1C2C': '1С2С',
} as const

export const samplesMoldingSandRecipeCoreMixturesCO2sOptions = dictToOptions(
  samplesMoldingSandRecipeCoreMixturesCO2Labels,
)

export const samplesMoldingSandRecipeLabels = {
  // Формувальні суміші
  ...samplesMoldingSandRecipeMoldingMixturesLabels,
  // Стрижневі суміші (CO2-процес)
  ...samplesMoldingSandRecipeCoreMixturesCO2Labels,
} as const

export type SamplesMoldingSandRecipe = keyof typeof samplesMoldingSandRecipeLabels
export const SamplesMoldingSandRecipe = dictFromKeys(samplesMoldingSandRecipeLabels)
export const samplesMoldingSandRecipeOptions = dictToOptions(samplesMoldingSandRecipeLabels)

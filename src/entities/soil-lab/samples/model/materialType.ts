import { dictFromKeys } from '@/utils/dict'

// Формувальні суміші
export const samplesMoldingSandRecipeMoldingMixturesLabels = {
  '13': '13 (Наповнювальна)',
  '14': '14 (Облицювальна)',
  '15': '15 (Для освіження)',
} as const
export type SamplesMoldingSandRecipe = keyof typeof samplesMoldingSandRecipeLabels
export const SamplesMoldingSandRecipe = dictFromKeys(samplesMoldingSandRecipeLabels)

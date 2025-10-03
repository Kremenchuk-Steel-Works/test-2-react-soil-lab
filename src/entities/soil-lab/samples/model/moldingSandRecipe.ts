import { dictFromKeys, dictToOptions } from '@/utils/dict'

export const samplesMoldingSandRecipeLabels = {
  '13': '13 (Наповнювальна)',
  '14': '14 (Облицювальна)',
  '15': '15 (Для освіження)',
  '8': '8',
  '1s': '1с',
  '1hs': '1хс',
  '1s1s': '1с1с',
  '1s2s': '1с2с',
} as const

export type SamplesMoldingSandRecipe = keyof typeof samplesMoldingSandRecipeLabels
export const SamplesMoldingSandRecipe = dictFromKeys(samplesMoldingSandRecipeLabels)
export const samplesMoldingSandRecipeOptions = dictToOptions(samplesMoldingSandRecipeLabels)

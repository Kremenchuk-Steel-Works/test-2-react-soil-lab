import { dictFromKeys, dictToOptions } from '@/utils/dict'

export const samplesMoldingSandRecipeLabels = {
  '13': '13 (Наповнювальна)',
  '14': '14 (Облицювальна)',
  '15': '15 (Для освіження)',
  '8': '8',
  '1C': '1С',
  '1XC': '1ХС',
  '1C1C': '1С1С',
  '1C2C': '1С2С',
} as const

export type SamplesMoldingSandRecipe = keyof typeof samplesMoldingSandRecipeLabels
export const SamplesMoldingSandRecipe = dictFromKeys(samplesMoldingSandRecipeLabels)
export const samplesMoldingSandRecipeOptions = dictToOptions(samplesMoldingSandRecipeLabels)

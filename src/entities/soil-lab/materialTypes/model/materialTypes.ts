import { dictFromKeys } from '@/utils/dict'

export const samplesMaterialTypesLabels = {
  moldingMixtures: 'Формувальні суміші',
  coreMixturesThermalDrying: 'Стрижневі суміші (теплова сушка)',
  coreMixturesCO2: 'Стрижневі суміші (СО₂-процес)',
  moldingMaterials: 'Формувальні матеріали',
  coreMaterials: 'Матеріали для виготовлення стрижнів',
  coreMixtureThermalDryingMaterials: 'Матеріали для виготовлення стрижневих сумішей теплової сушки',
  corePaints: 'Фарби для стрижнів',
  paintManufacturingMaterials: 'Матеріали для виготовлення фарби',
} as const
export type SamplesMaterialTypes = keyof typeof samplesMaterialTypesLabels
export const SamplesMaterialTypes = dictFromKeys(samplesMaterialTypesLabels)

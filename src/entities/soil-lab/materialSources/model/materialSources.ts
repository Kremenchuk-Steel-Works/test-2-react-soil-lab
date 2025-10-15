import { dictFromKeys } from '@/utils/dict'

export const samplesMaterialSourcesLabels = {
  // Лінії
  afl2: 'АФЛ 2',
  afl3: 'АФЛ 3',
  // Робочі точки / обладнання
  mixer: 'Змішувач',
  workplace: 'Робоче місце',
  cooler: 'Охолоджувач',
  beforeDrumDryer: 'Перед подачею у барабанне сушило',
  // Місця відбору/зберігання
  fromSemiMold: 'З напівформи',
  fromAccumulationBin: 'З накопичувальної банки',
  fromAccumulationBinAboveMixer: 'З накопичувальної банки над змішувачем',
  fromWorkshop: 'З цеху',
  // Контроль/якість
  incomingInspection: 'Вхідний контроль',
} as const
export type SamplesMaterialSources = keyof typeof samplesMaterialSourcesLabels
export const SamplesMaterialSources = dictFromKeys(samplesMaterialSourcesLabels)

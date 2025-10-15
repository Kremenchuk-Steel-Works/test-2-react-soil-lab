import { dictFromKeys } from '@/utils/dict'

export const samplesMaterialsLabels = {
  // 1) Формувальні суміші
  '13': '13 (Наповнювальна)',
  '14': '14 (Облицювальна)',
  '15': '15 (Для освіження)',
  // 2) Стрижневі суміші (теплова сушка)
  '5': '5',
  '5h': '5х',
  // 3) Стрижневі суміші (СО2-процес)
  '8': '8',
  '1s': '1с',
  '1hs': '1хс',
  '1s1s': '1с1с',
  '1s2s': '1с2с',
  coldBoxAmin: 'COLD-BOX-AMIN',
  '1alpha': '1α (альфа-сет)',
  // 4) Формувальні матеріали
  moldingSand: 'Пісок формувальний',
  bentonite: 'Бентоніт',
  returnSand: 'Відпрацьована суміш',
  // 5) Матеріали для виготовлення стрижнів
  ironOxide: 'Оксид заліза',
  chromiteSand: 'Хромітовий пісок',
  // 6) Матеріали для стрижневих сумішей теплової сушки
  lst: 'ЛСТ',
  ko: 'КО',
  // 7) Фарби для стрижнів
  '7': '7 (Рідкоскляна)',
  '8_teno': '8 (на основі TENO)',
  '8_isotec': '8 (на основі Isotec)',
  '10_velvalite': '10 (Velvalite)',
  // 8) Матеріали для виготовлення фарби
  ppht: 'Порошок периклазохромітовий ППХТ',
  liquidSodiumGlass: 'Скло натрієве рідке',
} as const
export type SamplesMaterials = keyof typeof samplesMaterialsLabels
export const SamplesMaterials = dictFromKeys(samplesMaterialsLabels)

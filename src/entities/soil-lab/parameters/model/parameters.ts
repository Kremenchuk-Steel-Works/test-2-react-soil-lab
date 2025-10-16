import { dictFromKeys } from '@/utils/dict'

export const testResultParametersLabels = {
  // Міцність
  compressive_strength: 'Міцність на стискання',
  tensile_strength: 'Міцність на розрив',
  tensile_strength_after_0_hours: 'Міцність на розрив зразу',
  tensile_strength_after_1_hour: 'Міцність на розрив через 1 год',
  tensile_strength_after_2_hours: 'Міцність на розрив через 2 год',
  tensile_strength_after_3_hours: 'Міцність на розрив через 3 год',
  tensile_strength_after_24_hours: 'Міцність на розрив через 24 год',
  residual_compressive_strength: 'Залишкова міцність',
  strength_in_moisture_condensation_zone: 'Міцність у зоні конденсації вологи',
  // Газові властивості
  gas_permeability: 'Газопроникність',
  gas_forming_property: 'Газоутворююча властивість',
  // Вологість / Температура
  moisture_percent: 'Вологість',
  moisture_before_cooler_percent: 'Вологість до охолоджувача',
  moisture_after_cooler_percent: 'Вологість після охолоджувача',
  temperature_celsius: 'Температура',
  temperature_before_cooler_celsius: 'Температура до охолоджувача',
  temperature_after_cooler_celsius: 'Температура після охолоджувача',
  // Технологічні показники формувальних сумішей
  moldability: 'Формувальність',
  friability_after_0_hours: 'Обсиплювальність зразу',
  friability_after_1_hour: 'Обсиплювальність через годину',
  flowability: 'Плинність',
  compactability: 'Ущільнювальність',
  // Гранулометрія / склад
  clay_content_percent: 'Глиниста складова',
  active_clay_percent: 'Активна глина',
  granulometric_composition: 'Гранулометричний склад',
  mean_grain_size: 'Середній розмір зерна',
  uniformity_coefficient: 'Коефіцієнт однорідності',
  // Хімічні/колоїдні
  ph: 'Водневий показник, pH',
  water_absorption_percent: 'Водопоглинання',
  colloidality_percent: 'Колоїдальність',
  thermal_stability: 'Термічна стійкість',
  // Фізичні
  density: 'Щільність',
  viscosity: "В'язкість",
  bulk_density: 'Насипна щільність',
  bulk_weight: 'Насипна вага',
  // Оглядові/індекси
  appearance: 'Зовнішній вигляд',
  afs_index: 'Показник AFS',
} as const
export type TestResultParameters = keyof typeof testResultParametersLabels
export const TestResultParameters = dictFromKeys(testResultParametersLabels)

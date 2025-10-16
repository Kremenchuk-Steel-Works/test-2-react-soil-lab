import {
  testResultParametersLabels,
  type TestResultParameters,
} from '@/entities/soil-lab/parameters/model/parameters'
import type { SnakeToCamel } from '@/types/utility'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

const {
  active_clay_percent,
  afs_index,
  appearance,
  bulk_density,
  bulk_weight,
  clay_content_percent,
  colloidality_percent,
  compactability,
  compressive_strength,
  density,
  flowability,
  friability_after_0_hours,
  friability_after_1_hour,
  gas_forming_property,
  gas_permeability,
  granulometric_composition,
  mean_grain_size,
  moisture_after_cooler_percent,
  moisture_before_cooler_percent,
  moisture_percent,
  moldability,
  ph,
  residual_compressive_strength,
  strength_in_moisture_condensation_zone,
  temperature_after_cooler_celsius,
  temperature_before_cooler_celsius,
  temperature_celsius,
  tensile_strength,
  tensile_strength_after_0_hours,
  tensile_strength_after_1_hour,
  tensile_strength_after_24_hours,
  tensile_strength_after_2_hours,
  tensile_strength_after_3_hours,
  thermal_stability,
  uniformity_coefficient,
  viscosity,
  water_absorption_percent,
} = testResultParametersLabels

export const testResultParametersFieldRegistry = createFieldRegistry.forKeys<
  SnakeToCamel<TestResultParameters>
>()({
  // Міцність
  compressiveStrength: {
    label: {
      short: 'Міцність на стиск',
      default: 'Міцність на стиск (кгс/см²)',
      raw: 'Міцність на стиск (Н/см²)',
    },
    unit: {
      default: 'кгс/см²',
      raw: 'Н/см²',
    },
  },
  tensileStrength: {
    label: {
      short: 'Міцність на розрив у висушеному стані',
      default: 'Міцність на розрив у висушеному стані (МПа)',
      raw: 'Міцність на розрив у висушеному стані (CHANGE)',
    },
    unit: { default: 'МПа', raw: 'CHANGE' },
  },
  tensileStrengthAfter0Hours: {
    label: {
      short: 'Міцність на розрив одразу',
      default: 'Міцність на розрив одразу (МПа)',
      raw: 'Міцність на розрив одразу (CHANGE)',
    },
    unit: { default: 'МПа', raw: 'CHANGE' },
  },
  tensileStrengthAfter1Hour: {
    label: {
      short: 'Міцність на розрив через 1 годину',
      default: 'Міцність на розрив через 1 годину (МПа)',
      raw: 'Міцність на розрив через 1 годину (CHANGE)',
    },
    unit: { default: 'МПа', raw: 'CHANGE' },
  },
  tensileStrengthAfter2Hours: {
    label: {
      short: 'Міцність на розрив через 2 години',
      default: 'Міцність на розрив через 2 години (МПа)',
      raw: 'Міцність на розрив через 2 години (CHANGE)',
    },
    unit: { default: 'МПа', raw: 'CHANGE' },
  },
  tensileStrengthAfter3Hours: {
    label: {
      short: 'Міцність на розрив через 3 години',
      default: 'Міцність на розрив через 3 години (МПа)',
      raw: 'Міцність на розрив через 3 години (CHANGE)',
    },
    unit: { default: 'МПа', raw: 'CHANGE' },
  },
  tensileStrengthAfter24Hours: {
    label: {
      short: 'Міцність на розрив через 24 години',
      default: 'Міцність на розрив через 24 години (МПа)',
      raw: 'Міцність на розрив через 24 години (CHANGE)',
    },
    unit: { default: 'МПа', raw: 'CHANGE' },
  },
  residualCompressiveStrength: {
    label: {
      short: 'Залишкова міцність',
      default: 'Залишкова міцність (Міцність на стискання) (CHANGE)',
      raw: 'Залишкова міцність (Міцність на стискання) (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  strengthInMoistureCondensationZone: {
    label: {
      short: 'Міцність у зоні конденсації вологи',
      default: 'Міцність у зоні конденсації вологи (CHANGE)',
      raw: 'Міцність у зоні конденсації вологи (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },

  // Газові властивості
  gasPermeability: {
    label: {
      short: 'Газопроникність',
      default: 'Газопроникність (од.)',
      raw: 'Газопроникність (m²/Pa·s)',
    },
    unit: { default: 'од.', raw: 'm²/Pa·s' },
  },
  gasFormingProperty: {
    label: {
      short: 'Газоутворююча властивість',
      default: 'Газоутворююча властивість (МПа)',
      raw: 'Газоутворююча властивість (CHANGE)',
    },
    unit: { default: 'МПа', raw: 'CHANGE' },
  },

  // Вологість / Температура
  moisturePercent: {
    label: { short: 'Вологість', default: 'Вологість (%)', raw: 'Вологість (CHANGE)' },
    unit: { default: '%', raw: 'CHANGE' },
  },
  moistureBeforeCoolerPercent: {
    label: {
      short: 'Вологість до охолоджувача',
      default: 'Вологість до охолоджувача (%)',
      raw: 'Вологість до охолоджувача (CHANGE)',
    },
    unit: { default: '%', raw: 'CHANGE' },
  },
  moistureAfterCoolerPercent: {
    label: {
      short: 'Вологість після охолоджувача',
      default: 'Вологість після охолоджувача (%)',
      raw: 'Вологість після охолоджувача (CHANGE)',
    },
    unit: { default: '%', raw: 'CHANGE' },
  },
  temperatureCelsius: {
    label: {
      short: 'Температура',
      default: 'Температура (°C)',
      raw: 'Температура (CHANGE)',
    },
    unit: { default: '°C', raw: 'CHANGE' },
  },
  temperatureBeforeCoolerCelsius: {
    label: {
      short: 'Температура до охолоджувача',
      default: 'Температура до охолоджувача (°C)',
      raw: 'Температура до охолоджувача (CHANGE)',
    },
    unit: { default: '°C', raw: 'CHANGE' },
  },
  temperatureAfterCoolerCelsius: {
    label: {
      short: 'Температура після охолоджувача',
      default: 'Температура після охолоджувача (°C)',
      raw: 'Температура після охолоджувача (CHANGE)',
    },
    unit: { default: '°C', raw: 'CHANGE' },
  },

  // Технологічні показники формувальних сумішей
  moldability: {
    label: {
      short: 'Формувальність',
      default: 'Формувальність (CHANGE)',
      raw: 'Формувальність (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  friabilityAfter0Hours: {
    label: {
      short: 'Обсиплювальність зразу',
      default: 'Обсиплювальність зразу (%)',
      raw: 'Обсиплювальність зразу (CHANGE)',
    },
    unit: { default: '%', raw: 'CHANGE' },
  },
  friabilityAfter1Hour: {
    label: {
      short: 'Обсиплювальність через 1 годину',
      default: 'Обсиплювальність через 1 годину (%)',
      raw: 'Обсиплювальність через 1 годину (CHANGE)',
    },
    unit: { default: '%', raw: 'CHANGE' },
  },
  flowability: {
    label: {
      short: 'Плинність',
      default: 'Плинність (CHANGE)',
      raw: 'Плинність (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  compactability: {
    label: {
      short: 'Ущільнювальність',
      default: 'Ущільнювальність (CHANGE)',
      raw: 'Ущільнювальність (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },

  // Гранулометрія / склад
  clayContentPercent: {
    label: {
      short: 'Глиниста складова',
      default: 'Глиниста складова (%)',
      raw: 'Глиниста складова (CHANGE)',
    },
    unit: { default: '%', raw: 'CHANGE' },
  },
  activeClayPercent: {
    label: {
      short: 'Активна глина',
      default: 'Активна глина (%)',
      raw: 'Активна глина (CHANGE)',
    },
    unit: { default: '%', raw: 'CHANGE' },
  },
  granulometricComposition: {
    label: {
      short: 'Гранулометричний склад',
      default: 'Гранулометричний склад (CHANGE)',
      raw: 'Гранулометричний склад (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  meanGrainSize: {
    label: {
      short: 'Середній розмір зерна',
      default: 'Середній розмір зерна (CHANGE)',
      raw: 'Середній розмір зерна (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  uniformityCoefficient: {
    label: {
      short: 'Коефіцієнт однорідності',
      default: 'Коефіцієнт однорідності (CHANGE)',
      raw: 'Коефіцієнт однорідності (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },

  // Хімічні/колоїдні
  ph: {
    label: {
      short: 'Водневий показник, pH',
      default: 'Водневий показник, pH (CHANGE)',
      raw: 'Водневий показник, pH (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  waterAbsorptionPercent: {
    label: {
      short: 'Водопоглинання',
      default: 'Водопоглинання (%)',
      raw: 'Водопоглинання (CHANGE)',
    },
    unit: { default: '%', raw: 'CHANGE' },
  },
  colloidalityPercent: {
    label: {
      short: 'Колоїдальність',
      default: 'Колоїдальність (%)',
      raw: 'Колоїдальність (CHANGE)',
    },
    unit: { default: '%', raw: 'CHANGE' },
  },
  thermalStability: {
    label: {
      short: 'Термічна стійкість',
      default: 'Термічна стійкість (CHANGE)',
      raw: 'Термічна стійкість (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },

  // Фізичні
  density: {
    label: {
      short: 'Щільність',
      default: 'Щільність (CHANGE)',
      raw: 'Щільність (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  viscosity: {
    label: {
      short: "В'язкість",
      default: "В'язкість (CHANGE)",
      raw: "В'язкість (CHANGE)",
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  bulkDensity: {
    label: {
      short: 'Насипна щільність',
      default: 'Насипна щільність (CHANGE)',
      raw: 'Насипна щільність (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  bulkWeight: {
    label: {
      short: 'Насипна вага',
      default: 'Насипна вага (CHANGE)',
      raw: 'Насипна вага (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },

  // Оглядові/індекси
  appearance: {
    label: {
      short: 'Зовнішній вигляд',
      default: 'Зовнішній вигляд (CHANGE)',
      raw: 'Зовнішній вигляд (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
  afsIndex: {
    label: {
      short: 'Показник AFS',
      default: 'Показник AFS (CHANGE)',
      raw: 'Показник AFS (CHANGE)',
    },
    unit: { default: 'CHANGE', raw: 'CHANGE' },
  },
})

import {
  testResultParametersLabels,
  type TestResultParameters,
} from '@/entities/soil-lab/parameters/model/parameters'
import type { SnakeToCamel } from '@/types/utility'
import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

const {
  active_clay,
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
  power_of_hydrogen,
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
      short: `${compressive_strength}`,
      default: `${compressive_strength} (кгс/см²)`,
      raw: `${compressive_strength} (Н/см²)`,
    },
    unit: {
      default: `кгс/см²`,
      raw: `Н/см²`,
    },
  },
  tensileStrength: {
    label: {
      short: `${tensile_strength}`,
      default: `${tensile_strength} (МПа)`,
    },
    unit: { default: `МПа` },
  },
  tensileStrengthAfter0Hours: {
    label: {
      short: `${tensile_strength_after_0_hours}`,
      default: `${tensile_strength_after_0_hours} (МПа)`,
    },
    unit: { default: `МПа` },
  },
  tensileStrengthAfter1Hour: {
    label: {
      short: `${tensile_strength_after_1_hour}`,
      default: `${tensile_strength_after_1_hour} (МПа)`,
    },
    unit: { default: `МПа` },
  },
  tensileStrengthAfter2Hours: {
    label: {
      short: `${tensile_strength_after_2_hours}`,
      default: `${tensile_strength_after_2_hours} (МПа)`,
    },
    unit: { default: `МПа` },
  },
  tensileStrengthAfter3Hours: {
    label: {
      short: `${tensile_strength_after_3_hours}`,
      default: `${tensile_strength_after_3_hours} (МПа)`,
    },
    unit: { default: `МПа` },
  },
  tensileStrengthAfter24Hours: {
    label: {
      short: `${tensile_strength_after_24_hours}`,
      default: `${tensile_strength_after_24_hours} (МПа)`,
    },
    unit: { default: `МПа` },
  },
  residualCompressiveStrength: {
    label: {
      short: `${residual_compressive_strength}`,
      default: `${residual_compressive_strength} (кгс/см²)`,
      raw: `${residual_compressive_strength} (Н/см²)`,
    },
    unit: { default: `кгс/см²`, raw: `Н/см²` },
  },
  strengthInMoistureCondensationZone: {
    label: {
      short: `${strength_in_moisture_condensation_zone}`,
      default: `${strength_in_moisture_condensation_zone} (кгс/см²)`,
      raw: `${strength_in_moisture_condensation_zone} (кПа)`,
    },
    unit: { default: `кгс/см²`, raw: `кПа` },
  },

  // Газові властивості
  gasPermeability: {
    label: {
      short: `${gas_permeability}`,
      default: `${gas_permeability} (од.)`,
      raw: `${gas_permeability} (m²/Pa·s)`,
    },
    unit: { default: `од.`, raw: `m²/Pa·s` },
  },
  gasFormingProperty: {
    label: {
      short: `${gas_forming_property}`,
      default: `${gas_forming_property} (см³/г)`,
    },
    unit: { default: `см³/г` },
  },

  // Вологість / Температура
  moisturePercent: {
    label: { short: `${moisture_percent}`, default: `${moisture_percent} (%)` },
    unit: { default: `%` },
  },
  moistureBeforeCoolerPercent: {
    label: {
      short: `${moisture_before_cooler_percent}`,
      default: `${moisture_before_cooler_percent} (%)`,
    },
    unit: { default: `%` },
  },
  moistureAfterCoolerPercent: {
    label: {
      short: `${moisture_after_cooler_percent}`,
      default: `${moisture_after_cooler_percent} (%)`,
    },
    unit: { default: `%` },
  },
  temperatureCelsius: {
    label: {
      short: `${temperature_celsius}`,
      default: `${temperature_celsius} (°C)`,
    },
    unit: { default: `°C` },
  },
  temperatureBeforeCoolerCelsius: {
    label: {
      short: `${temperature_before_cooler_celsius}`,
      default: `${temperature_before_cooler_celsius} (°C)`,
    },
    unit: { default: `°C` },
  },
  temperatureAfterCoolerCelsius: {
    label: {
      short: `${temperature_after_cooler_celsius}`,
      default: `${temperature_after_cooler_celsius} (°C)`,
    },
    unit: { default: `°C` },
  },

  // Технологічні показники формувальних сумішей
  moldability: {
    label: {
      short: `${moldability}`,
      default: `${moldability} (%)`,
      m: `Маса зразка суміші (г)`,
      m1: `Маса пройденої суміші (г)`,
    },
    unit: { default: `%`, m: `г`, m1: `г` },
  },
  friabilityAfter0Hours: {
    label: {
      short: `${friability_after_0_hours}`,
      default: `${friability_after_0_hours} (%)`,
      m: `Маса зразка до випробування (г)`,
      m1: `Маса зразка після випробування (г)`,
    },
    unit: { default: `%`, m: `г`, m1: `г` },
  },
  friabilityAfter1Hour: {
    label: {
      short: `${friability_after_1_hour}`,
      default: `${friability_after_1_hour} (%)`,
      m: `Маса зразка до випробування (г)`,
      m1: `Маса зразка після випробування (г)`,
    },
    unit: { default: `%`, m: `г`, m1: `г` },
  },
  flowability: {
    label: {
      short: `${flowability}`,
      default: `${flowability} (%)`,
      hA: `Твердість зразка у точці A (од.)`,
      hB: `Твердість зразка у точці B (од.)`,
    },
    unit: { default: `%`, hA: `од.`, hB: `од.` },
  },
  compactability: {
    label: {
      short: `${compactability}`,
      default: `${compactability} (%)`,
      h: `Висота суміші, гільзи до ущільнення (мм)`,
      h1: `висота суміші, гільзи після ущільнення (мм)`,
    },
    unit: { default: `%`, h: `мм`, h1: `мм` },
  },

  // Гранулометрія / склад
  clayContentPercent: {
    label: {
      short: `${clay_content_percent}`,
      default: `${clay_content_percent} (%)`,
      m: `Маса наважки (г)`,
      m1: `Маса наважки після видалення глинистої складової (г)`,
    },
    unit: { default: `%`, m: `г`, m1: `г` },
  },
  activeClay: {
    label: {
      short: `${active_clay}`,
      default: `${active_clay} (мл)`,
    },
    unit: { default: `мл` },
  },
  granulometricComposition: {
    label: {
      short: `${granulometric_composition}`,
      default: `Масова доля залишку`,
      raw: `Маса залишку`,
      sieve2p5MmMass: `на ситі 2.5 мм`,
      sieve1p6MmMass: `на ситі 1.6 мм`,
      sieve1MmMass: `на ситі 1.0 мм`,
      sieve0p63MmMass: `на ситі 0.63 мм`,
      sieve0p4MmMass: `на ситі 0.4 мм`,
      sieve0p315MmMass: `на ситі 0.315 мм`,
      sieve0p2MmMass: `на ситі 0.2 мм`,
      sieve0p16MmMass: `на ситі 0.16 мм`,
      sieve0p1MmMass: `на ситі 0.1 мм`,
      sieve0p063MmMass: `на ситі 0.063 мм`,
      sieve0p05MmMass: `на ситі 0.05 мм`,
      panMass: `на піддоні`,
      initialSampleMass: `Маса вихідної наважки (г)`,
    },
    unit: { default: `%`, raw: `г` },
  },
  meanGrainSize: {
    label: {
      short: `${mean_grain_size}`,
      default: `Середній розмір зерна (мм)`,
    },
    unit: { default: `мм` },
  },
  uniformityCoefficient: {
    label: {
      short: `${uniformity_coefficient}`,
      default: `${uniformity_coefficient} (%)`,
    },
    unit: { default: `%` },
  },

  // Хімічні/колоїдні
  powerOfHydrogen: {
    label: {
      short: `${power_of_hydrogen}`,
      default: `${power_of_hydrogen} (од.)`,
    },
    unit: { default: `од.` },
  },
  waterAbsorptionPercent: {
    label: {
      short: `${water_absorption_percent}`,
      default: `${water_absorption_percent} (%)`,
      m: `Маса наважки (г)`,
      m1: `Загальний об’єм доданої води (мм)`,
    },
    unit: { default: `%`, m: `г`, m1: `мм` },
  },
  colloidalityPercent: {
    label: {
      short: `${colloidality_percent}`,
      default: `${colloidality_percent} (%)`,
      raw: `Об’єм осаду глини у пробірці, (см³)`,
    },
    unit: { default: `%`, raw: `см³` },
  },
  thermalStability: {
    label: {
      short: `${thermal_stability}`,
      default: `${thermal_stability} (од.)`,
      sigma1: `Межа міцності на стискання у вологому стані суміші (кгс/см²)`,
      sigma2: `Результат випробування (кгс/см²)`,
    },
    unit: { default: `од.`, sigma1: `кгс/см²`, sigma2: `кгс/см²` },
  },

  // Фізичні
  density: {
    label: {
      short: `${density}`,
      default: `${density} (г/см³)`,
    },
    unit: { default: `г/см³` },
  },
  viscosity: {
    label: {
      short: `${viscosity}`,
      default: `${viscosity} (с)`,
    },
    unit: { default: `с` },
  },
  bulkDensity: {
    label: {
      short: `${bulk_density}`,
      default: `${bulk_density} (г/см³)`,
      m: `Маса матеріалу (см³)`,
      V: `Об’єм (г)`,
    },
    unit: { default: `г/см³`, m: `см³`, V: `г` },
  },
  bulkWeight: {
    label: {
      short: `${bulk_weight}`,
      default: `${bulk_weight} (г/см³)`,
      m: `Маса матеріалу (см³)`,
      V: `Об’єм (г)`,
    },
    unit: { default: `г/см³`, m: `см³`, V: `г` },
  },

  // Оглядові/індекси
  appearance: {
    label: {
      default: `${appearance}`,
      raw: `Відповідає вимогам`,
    },
  },
  afsIndex: {
    label: {
      short: `${afs_index}`,
      default: `Масова доля залишку`,
      raw: `Маса залишку`,
      sieve1p25MmMass: `на ситі 1.25 мм`,
      sieve1MmMass: `на ситі 1.0 мм`,
      sieve0p7MmMass: `на ситі 0.7 мм`,
      sieve0p5MmMass: `на ситі 0.5 мм`,
      sieve0p355MmMass: `на ситі 0.355 мм`,
      sieve0p25MmMass: `на ситі 0.25 мм`,
      sieve0p18MmMass: `на ситі 0.18 мм`,
      sieve0p125MmMass: `на ситі 0.125 мм`,
      sieve0p09MmMass: `на ситі 0.09 мм`,
      sieve0p063MmMass: `на ситі 0.063 мм`,
      panMass: `на піддоні`,
      initialSampleMass: `Маса вихідної наважки (г)`,
    },
    unit: { default: `%`, raw: `г` },
  },
})

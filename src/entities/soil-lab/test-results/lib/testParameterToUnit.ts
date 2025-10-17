import { testResultParametersFieldRegistry } from '@/entities/soil-lab/parameters/model/fields-registry'
import { TestResultParameters } from '@/entities/soil-lab/parameters/model/parameters'

type FR = typeof testResultParametersFieldRegistry
type FRKey = keyof FR
type Entry = FR[FRKey]
type EntryWithUnit = Extract<Entry, { unit: unknown }>

/** snake_case → camelCase */
function snakeToCamel(s: string): string {
  let res = ''
  let upperNext = false
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '_') {
      upperNext = true
    } else {
      res += upperNext ? ch.toUpperCase() : ch
      upperNext = false
    }
  }
  return res
}

/** Проверяем, что строка — реальный ключ реестра */
function isFRKey(k: string): k is FRKey {
  return k in testResultParametersFieldRegistry
}

/** Проверяем, что у записи есть поле unit */
function hasUnit(e: Entry): e is EntryWithUnit {
  return 'unit' in e
}

/** Возвращаем символ единицы */
export function testTypeToUnit(testType: TestResultParameters): string {
  const candidate = snakeToCamel(testType) // string

  if (!isFRKey(candidate)) return ''

  const entry = testResultParametersFieldRegistry[candidate] // Entry
  if (hasUnit(entry)) {
    const def = entry.unit.default
    // def уже строго string по типам EntryWithUnit
    return def
  }

  return ''
}

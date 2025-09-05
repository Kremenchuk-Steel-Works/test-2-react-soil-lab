import type { ReadonlyDeep } from 'type-fest'

/**
 * Варианты текстовых подписей поля.
 * Используются для выбора отображаемой метки (по умолчанию, короткая, полная).
 */
export type LabelVariant = 'default' | 'short' | 'full'
export type LabelVariants = Readonly<{
  default: string
  short?: string
  full?: string
}>

/**
 * Форма входных данных для реестра:
 * объект, где ключ — системное имя поля, значение — метаданные (сейчас только `label`).
 */
type LabelsShape = Record<string, { label: LabelVariants }>

/**
 * Токен (элемент реестра) для одного поля.
 * - `key` — литеральное имя поля (используется как ключ в формах/схемах).
 * - `label` — набор подписей для UI.
 */
export type FieldToken<K extends string, L extends LabelVariants = LabelVariants> = Readonly<{
  key: K
  label: L
}>

/**
 * Тип возвращаемого реестра: отображение исходных ключей на токены.
 * Гарантирует, что автоподсказки будут по всем ключам из входного `labels`.
 */
export type Registry<M extends LabelsShape> = {
  readonly [K in Extract<keyof M, string>]: FieldToken<K, M[K]['label']>
}
/**
 * Создаёт неизменяемый реестр полей для типобезопасного использования в коде.
 *
 * Назначение:
 * - Централизовать описание ключей полей и их меток (для форм, схем валидации и UI).
 * - Сохранить литеральные типы ключей (например, `"moldingSandNumber"`), чтобы работало автодополнение.
 * - Обеспечить иммутабельность структуры (Object.freeze), исключив случайные мутации.
 *
 * Параметры:
 * @param labels — источник правды по полям (ключи + наборы меток). Принимается как ReadonlyDeep<M> для лучшей дисциплины неизменяемости.
 *
 * Возвращает:
 * @returns Реестр (Registry<M>), в котором:
 *  - каждый токен имеет вид `{ key: <literal>, label: { default, short?, full? } }`,
 *  - сам токен и весь реестр — замороженные объекты (immutable).
 *
 * Гарантии и детали реализации:
 * - Сохраняет литеральность ключей через `as const`-совместимый generic M.
 * - Время выполнения O(n) по количеству полей.
 * - Нет побочных эффектов, кроме создания нового объекта-реестра.
 *
 * Пример использования:
 *  const FR = createFieldRegistry({
 *    moldingSandNumber: { label: { default: '№ суміші', short: '№' } },
 *  } as const)
 *  // FR.moldingSandNumber.key  -> "moldingSandNumber"
 *  // FR.moldingSandNumber.label.default -> "№ суміші"
 *  // FR.moldingSandNumber.label.short   -> "№" | undefined
 */
export function createFieldRegistry<const M extends LabelsShape>(
  labels: ReadonlyDeep<M>,
): Registry<M> {
  type Key = Extract<keyof M, string>
  const out: { [K in Key]?: FieldToken<K, M[K]['label']> } = {}

  ;(Object.keys(labels) as Key[]).forEach((k) => {
    const { label } = labels[k]
    out[k] = Object.freeze({
      key: k,
      label: Object.freeze(label),
    }) as FieldToken<Key, M[Key]['label']>
  })

  return Object.freeze(out) as Registry<M>
}

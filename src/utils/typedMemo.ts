import { memo, type ComponentType } from 'react'

/**
 * Сохраняет дженерики компонента (возвращает тот же тип C),
 * не использует `any`, и работает с generic FC.
 */
export function typedMemo<C>(
  component: C,
  propsAreEqual?: (prev: Readonly<unknown>, next: Readonly<unknown>) => boolean,
): C {
  return memo(component as unknown as ComponentType<unknown>, propsAreEqual) as unknown as C
}

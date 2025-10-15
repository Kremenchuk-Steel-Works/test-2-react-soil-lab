import { Pill, type PillProps } from '@/shared/ui/pill/Pill'

type Props = Omit<PillProps, 'variant' | 'icon'> & {
  isCompliant: boolean
}

/** Маппинг доменного статуса на UI-вид */
const map = {
  true: { variant: 'success' },
  false: { variant: 'warning' },
} as const satisfies Record<'true' | 'false', { variant: PillProps['variant'] }>

export function TestStatusPill({ isCompliant, children, ...rest }: Props) {
  const { variant } = map[isCompliant ? 'true' : 'false']
  return (
    <Pill variant={variant} {...rest}>
      {children}
    </Pill>
  )
}

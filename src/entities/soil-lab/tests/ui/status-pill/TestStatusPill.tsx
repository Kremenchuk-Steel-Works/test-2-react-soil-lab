import { TestStatus } from '@/shared/api/soil-lab/model'
import { Pill, type PillProps } from '@/shared/ui/pill/Pill'

type Props = Omit<PillProps, 'variant' | 'icon'> & {
  status: TestStatus
}

/** Маппинг доменного статуса на UI-вид */
const map = {
  [TestStatus.passed]: {
    variant: 'success' as const,
  },
  [TestStatus.failed]: {
    variant: 'warning' as const,
  },
  default: {
    variant: 'neutral' as const,
  },
}

export function TestStatusPill({ status, children, ...rest }: Props) {
  const { variant } = map[status] ?? map.default
  return (
    <Pill variant={variant} {...rest}>
      {children}
    </Pill>
  )
}

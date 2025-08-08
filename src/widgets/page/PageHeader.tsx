import { usePageHeaderButtons } from '@/shared/hooks/usePageHeaderButtons'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs'
import Button from '@/shared/ui/button/Button'
import type { PreparedButtonProps } from '@/utils/prepareButtonLogic'

export function PageHeader() {
  const buttons = usePageHeaderButtons()

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Breadcrumbs />
      {buttons.length > 0 && (
        <div className="flex items-center gap-x-2">
          {buttons.map(({ key, label, Icon, ...buttonProps }: PreparedButtonProps) => (
            <Button key={key} {...buttonProps}>
              <Icon className="h-5 w-5" />
              {/* Для мобильных устройств оставляем только иконку */}
              <span className="hidden md:inline">{label}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

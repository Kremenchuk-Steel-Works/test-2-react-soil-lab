import { usePageHeaderActions } from '@/shared/hooks/usePageHeaderActions'
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs/Breadcrumbs'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

export function PageHeader() {
  const actions = usePageHeaderActions()

  return (
    // min-h равна высоте кнопки: h-10 = 2.5rem
    <div className="flex min-h-[2.5rem] flex-wrap items-center justify-between gap-4">
      <Breadcrumbs />
      {actions.length > 0 && (
        <div className="flex items-center gap-x-2">
          {actions.map((a) => (
            <ConfiguredButton key={a} btnType={a} />
          ))}
        </div>
      )}
    </div>
  )
}

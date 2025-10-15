import { createRouteKeyNs } from '@/app/routes/utils/route-key'
import { DashboardGrid } from '@/widgets/page/DashboardGrid'

const routeKeys = createRouteKeyNs('admin')

export default function AdminPanelIndexPage() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <DashboardGrid parentRouteKey={routeKeys()} />
    </div>
  )
}

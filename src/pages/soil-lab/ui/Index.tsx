import { createRouteKeyNs } from '@/app/routes/utils/route-key'
import { DashboardGrid } from '@/widgets/page/DashboardGrid'

const routeKeys = createRouteKeyNs('soilLab')

export default function SoilLabMainPage() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <DashboardGrid parentRouteKey={routeKeys()} />
    </div>
  )
}

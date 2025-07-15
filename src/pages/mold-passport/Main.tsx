import { DashboardGrid } from '@/widgets/page/DashboardGrid'

export default function MoldPassportMain() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <DashboardGrid parentRouteKey="mold" />
    </div>
  )
}

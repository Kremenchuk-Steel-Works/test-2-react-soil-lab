import { DashboardGrid } from '@/widgets/page/DashboardGrid'

export default function NDTDocumentsMainPage() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <DashboardGrid variant="table" parentRouteKey="NDTDocuments" />
    </div>
  )
}

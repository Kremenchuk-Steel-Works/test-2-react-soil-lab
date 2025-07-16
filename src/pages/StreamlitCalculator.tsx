import MainLayout from '@/widgets/page-layout/MainLayout'
import { PageHeader } from '@/widgets/page/PageHeader'

export default function StreamlitCalculator() {
  return (
    <MainLayout>
      <div className="flex flex-1 flex-col space-y-2">
        <PageHeader />
        <div className="w-ful block h-full">
          <iframe src="http://138.199.209.211:8502" width="100%" height="900px" />
        </div>
      </div>
    </MainLayout>
  )
}

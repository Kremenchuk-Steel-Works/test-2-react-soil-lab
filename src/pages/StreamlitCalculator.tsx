import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/app/routes/paths'
import Button from '@/shared/ui/button/Button'
import Layout from '@/widgets/page-layout/Layout'

export default function StreamlitCalculator() {
  const navigate = useNavigate()
  return (
    <Layout>
      <div className="space-y-2">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate(PATHS.MAIN)}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
        </Button>
        <div className="block h-full w-full">
          <iframe src="http://195.189.63.125:8502" width="100%" height="900px" />
        </div>
      </div>
    </Layout>
  )
}

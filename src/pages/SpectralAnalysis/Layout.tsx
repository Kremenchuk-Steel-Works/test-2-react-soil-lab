import Layout from "../../components/Template/Layout"
import { Outlet } from "react-router-dom"

export default function SpectralAnalysisLayout() {
  return (
    <Layout>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="layout-text">Спектральний аналіз</h4>
        </div>
        <Outlet />
      </div>
    </Layout>
  )
}

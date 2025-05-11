import Button from "../../components/Button/Button"
// import { useAuth } from "../../components/AuthProvider/AuthContext"
// import log from "../../utils/logger"
import { useNavigate } from "react-router-dom"
// import { PATHS } from "../../routes/AppRoutes"
import { ArrowLeft, Plus } from "lucide-react"
import { useEffect, useState } from "react"

type SpectralRecord = {
  id: number
  heat_id: number
  spectrometer_id: number
  user_id: number
  created_at: string
}

export default function SpectralAnalysisList() {
  const navigate = useNavigate()
  const [data, setData] = useState<SpectralRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // const response = await apiSpectralData()
        const response = [
          {
            id: 1,
            heat_id: 1,
            spectrometer_id: 1,
            user_id: 1,
            created_at: "2022-01-01",
          },
          {
            id: 2,
            heat_id: 1,
            spectrometer_id: 1,
            user_id: 1,
            created_at: "2022-01-01",
          },
          {
            id: 3,
            heat_id: 1,
            spectrometer_id: 1,
            user_id: 1,
            created_at: "2022-01-01",
          },
        ]
        setData(response)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("add")}
        >
          <Plus className="w-5 h-5" /> <span>Додати</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        {loading && <p>Завантаження даних...</p>}
        {error && <p className="text-red-600">Помилка: {error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Heat ID</th>
                  <th className="px-4 py-2 text-left">Spectrometer ID</th>
                  <th className="px-4 py-2 text-left">User ID</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {data.map((rec) => (
                  <tr
                    key={rec.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-2">{rec.id}</td>
                    <td className="px-4 py-2">{rec.heat_id}</td>
                    <td className="px-4 py-2">{rec.spectrometer_id}</td>
                    <td className="px-4 py-2">{rec.user_id}</td>
                    <td className="px-4 py-2">
                      {new Date(rec.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

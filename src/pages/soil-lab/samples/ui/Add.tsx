import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import SamplesCreate from '@/features/soil-lab/samples/create/ui/SamplesCreate'
import type { SampleDetailResponse } from '@/shared/api/soil-lab-2/model'

export default function SamplesAdd() {
  const navigate = useNavigate()

  const onSuccess = useCallback(
    (res: SampleDetailResponse) => {
      void navigate(`../${res.id}/update`)
    },
    [navigate],
  )

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        <SamplesCreate onSuccess={onSuccess} />
      </div>
    </div>
  )
}

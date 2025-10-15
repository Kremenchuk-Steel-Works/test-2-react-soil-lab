import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageAction, segment } from '@/app/routes/types'
import SamplesCreate from '@/features/soil-lab/samples/create/ui/SamplesCreate'
import type { SampleDetailResponse } from '@/shared/api/soil-lab/model'

export default function SamplesNewPage() {
  const navigate = useNavigate()

  const onSuccess = useCallback(
    (res: SampleDetailResponse) => {
      void navigate(`../${res.id}/${segment(PageAction.update)}`)
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

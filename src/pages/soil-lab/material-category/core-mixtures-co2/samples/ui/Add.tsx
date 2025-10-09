import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageAction, segment } from '@/app/routes/types'
import { samplesMoldingSandRecipeCoreMixturesCO2sOptions } from '@/entities/soil-lab/samples/model/moldingSandRecipe'
import type { SamplesCreateOptions } from '@/entities/soil-lab/samples/ui/form/fields'
import SamplesCreate from '@/features/soil-lab/samples/create/ui/SamplesCreate'
import type { SampleDetailResponse } from '@/shared/api/soil-lab/model'

const options: SamplesCreateOptions['options'] = {
  moldingSandRecipe: samplesMoldingSandRecipeCoreMixturesCO2sOptions,
}

export default function SamplesAddPage() {
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
        <SamplesCreate onSuccess={onSuccess} options={options} />
      </div>
    </div>
  )
}

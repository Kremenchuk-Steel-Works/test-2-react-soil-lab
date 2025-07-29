import { useNavigate } from 'react-router-dom'
import { personService } from '@/entities/admin/people/services/service'
import MoldPassportForm from '@/entities/mold-passport (old)/mold-passport/forms/form'
import type { MoldPassportFormFieldsOld } from '@/entities/mold-passport (old)/mold-passport/forms/schema'
import { CachedForm, type CacheConfig } from '@/shared/ui/react-hook-form/cached-form/CachedForm'

const moldPassportCacheConfig: CacheConfig<MoldPassportFormFieldsOld> = {
  enabled: true,
  cacheKey: 'formCache:moldPassport:create',
  fieldsToCache: ['firstName', 'gender'],
  ttl: 5 * 60 * 1000,
}

export default function MoldPassportAddOld() {
  const navigate = useNavigate()

  const handleSubmit = async (data: MoldPassportFormFieldsOld) => {
    await personService.create(data)

    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <CachedForm<MoldPassportFormFieldsOld>
            cacheConfig={moldPassportCacheConfig}
            onSubmit={handleSubmit}
          >
            {({ defaultValues, onSubmit }) => (
              <MoldPassportForm
                initialData={{ defaultValues }}
                onSubmit={onSubmit}
                submitBtnName="Додати"
              />
            )}
          </CachedForm>
        </div>
      </div>
    </>
  )
}

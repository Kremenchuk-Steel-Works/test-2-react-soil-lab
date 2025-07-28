import { useNavigate } from 'react-router-dom'
import { personService } from '@/entities/admin/people/services/service'
import MoldPassportForm from '@/entities/mold-passport/mold-passport/forms/form'
import type { MoldPassportFormFields } from '@/entities/mold-passport/mold-passport/forms/schema'
import { useFormCache } from '@/shared/hooks/react-hook-form/useFormCache'

// Уникальный ключ для кэша этой формы
const FORM_CACHE_KEY = 'formCache:moldPassport'

// Поля, которые мы хотим сохранять
const FIELDS_TO_CACHE: (keyof MoldPassportFormFields)[] = ['firstName', 'gender']

export default function MoldPassportAdd() {
  const navigate = useNavigate()
  const { cachedData, saveData } = useFormCache<MoldPassportFormFields>(
    FORM_CACHE_KEY,
    FIELDS_TO_CACHE,
    { ttl: 1 * 60 * 1000 },
  )

  const handleSubmit = async (data: MoldPassportFormFields) => {
    await personService.create(data)

    // Сохраняем данные в кэш после успешной отправки
    saveData(data)

    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldPassportForm
            initialData={{ defaultValues: cachedData || {} }}
            onSubmit={handleSubmit}
            submitBtnName="Додати"
          />
        </div>
      </div>
    </>
  )
}

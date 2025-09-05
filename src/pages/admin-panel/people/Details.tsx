import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { personQueryKeys } from '@/entities/admin-old/people/services/keys'
import { personService } from '@/entities/admin-old/people/services/service'
import type { PersonDetailResponse } from '@/entities/admin-old/people/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminPeopleDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PersonDetailResponse, Error>({
    queryKey: personQueryKeys.detail(id!),
    queryFn: () => personService.getById(id!),
    enabled: !!id,
  })

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}
      {!isLoading && !isError && data && (
        <div className="bg-white p-6 dark:bg-gray-800">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.id}</dd>
            </div>

            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Повне ім'я</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.lastName} {data.firstName} {data.middleName ?? ''}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Стать</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.gender}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Користувач</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.isUser ? 'Так' : 'Ні'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Працівник</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.employeeProfile ? 'Так' : 'Ні'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Кількість контактів
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.contacts.length}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Кількість адрес
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.addresses.length}
              </dd>
            </div>

            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Організації</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.organizations.map((org) => org.legalName).join(', ')}
              </dd>
            </div>

            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Посади</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.positions.map((pos) => pos.name).join(', ')}
              </dd>
            </div>

            {data.birthDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Дата народження
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {new Date(data.birthDate).toLocaleDateString()}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Створено</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {new Date(data.createdAt).toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Оновлено</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {new Date(data.updatedAt).toLocaleString()}
              </dd>
            </div>

            {data.photoUrl && (
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Фото</dt>
                <dd className="mt-1">
                  <img
                    src={URL.createObjectURL(data.photoUrl)}
                    alt="Фото користувача"
                    className="h-10 w-10 rounded object-cover"
                  />
                </dd>
              </div>
            )}

            {/* Контакти */}
            {data.contacts.map((contact, index) => (
              <div key={`contact-${index}`} className="pt-4 md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Контакт {index + 1}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  <div>Тип: {contact.type}</div>
                  <div>Значення: {contact.value}</div>
                  {contact.note && <div>Примітка: {contact.note}</div>}
                  <div>Основний: {contact.isPrimary ? 'Так' : 'Ні'}</div>
                </dd>
              </div>
            ))}

            {/* Адреси */}
            {data.addresses.map((addr, index) => (
              <div key={`address-${index}`} className="border-t pt-4 md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Адреса {index + 1}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  <div>Вулиця: {addr.fullAddress}</div>
                  <div>Поштовий код: {addr.postalCode}</div>
                  <div>Тип: {addr.type}</div>
                  {addr.note && <div>Примітка: {addr.note}</div>}
                  <div>Основна: {addr.isPrimary ? 'Так' : 'Ні'}</div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </>
  )
}

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { organizationQueryKeys } from '@/entities/admin/organizations/services/keys'
import { organizationService } from '@/entities/admin/organizations/services/service'
import type { OrganizationDetailResponse } from '@/entities/admin/organizations/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminOrganizationsDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<OrganizationDetailResponse, Error>({
    queryKey: organizationQueryKeys.detail(id!),
    queryFn: () => organizationService.getById(id!),
    enabled: !!id,
  })

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}
      {!isLoading && !isError && data && (
        <div className="bg-white p-6 dark:bg-gray-800">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <dt>ID</dt>
              <dd>{data.id}</dd>
            </div>

            <div>
              <dt>Назва</dt>
              <dd>{data.legalName}</dd>
            </div>

            <div>
              <dt>Реєстраційний номер</dt>
              <dd>{data.registrationNumber}</dd>
            </div>

            <div>
              <dt>Податковий номер</dt>
              <dd>{data.taxId}</dd>
            </div>

            <div>
              <dt>Країна (код)</dt>
              <dd>{data.country.code}</dd>
            </div>

            <div>
              <dt>Країна (назва)</dt>
              <dd>{data.country.name}</dd>
            </div>

            <div>
              <dt>Країна (локалізовано)</dt>
              <dd>{data.country.nameLocal}</dd>
            </div>

            <div>
              <dt>Email</dt>
              <dd>{data.contacts.find((c) => c.type === 'email' && c.isPrimary)?.value || '—'}</dd>
            </div>

            <div>
              <dt>Телефон</dt>
              <dd>{data.contacts.find((c) => c.type === 'phone' && c.isPrimary)?.value || '—'}</dd>
            </div>

            <div>
              <dt>Інші контакти</dt>
              <dd>
                {data.contacts.find((c) => c.type !== 'phone' && c.type !== 'email' && c.isPrimary)
                  ?.value || '—'}
              </dd>
            </div>

            <div>
              <dt>Створено</dt>
              <dd>{new Date(data.createdAt).toLocaleString()}</dd>
            </div>

            <div>
              <dt>Оновлено</dt>
              <dd>{new Date(data.updatedAt).toLocaleString()}</dd>
            </div>

            <div>
              <dt>Основна адреса</dt>
              <dd>
                {(() => {
                  const addr = data.addresses.find((a) => a.isPrimary)
                  return addr
                    ? `${addr.street}, ${addr.postalCode} (${addr.type}) - ${addr.note}`
                    : '—'
                })()}
              </dd>
            </div>

            <div>
              <dt>Додаткова адреса</dt>
              <dd>
                {(() => {
                  const addr = data.addresses.find((a) => !a.isPrimary)
                  return addr
                    ? `${addr.street}, ${addr.postalCode} (${addr.type}) - ${addr.note}`
                    : '—'
                })()}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </>
  )
}

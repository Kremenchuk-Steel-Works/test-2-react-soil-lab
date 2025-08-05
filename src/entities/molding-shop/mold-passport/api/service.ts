import {
  getGetOrganizationsListApiV1LookupsOrganizationsGetQueryOptions,
  getGetPositionsListApiV1LookupsPositionsGetQueryOptions,
  useGetOrganizationsListApiV1LookupsOrganizationsGet,
  useGetPositionsListApiV1LookupsPositionsGet,
} from '@/shared/api/main-service/endpoints/lookups/lookups'
import { getGetPeopleListApiV1PeopleGetQueryOptions } from '@/shared/api/main-service/endpoints/people/people'

export const useMoldPassportService = {
  lookupOrganization: useGetOrganizationsListApiV1LookupsOrganizationsGet,
  lookupPosition: useGetPositionsListApiV1LookupsPositionsGet,
}

export const moldPassportService = {
  lookupOrganization: getGetOrganizationsListApiV1LookupsOrganizationsGetQueryOptions,
  lookupPosition: getGetPositionsListApiV1LookupsPositionsGetQueryOptions,
  getList: getGetPeopleListApiV1PeopleGetQueryOptions,
}

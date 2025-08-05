import {
  getGetOrganizationsListApiV1LookupsOrganizationsGetResponseMock,
  getGetPositionsListApiV1LookupsPositionsGetResponseMock,
} from '@/shared/api/main-service/endpoints/lookups/lookups.msw'

export const moldPassportMockService = {
  lookupOrganization: getGetOrganizationsListApiV1LookupsOrganizationsGetResponseMock,
  lookupPosition: getGetPositionsListApiV1LookupsPositionsGetResponseMock,
}

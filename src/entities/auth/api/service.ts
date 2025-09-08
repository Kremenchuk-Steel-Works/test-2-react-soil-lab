import {
  useLoginApiV1AuthLoginPost,
  useRefreshAccessTokenApiV1AuthRefreshPost,
} from '@/shared/api/soil-lab/endpoints/auth/auth'

export const authService = {
  login: useLoginApiV1AuthLoginPost,
  refresh: useRefreshAccessTokenApiV1AuthRefreshPost,
}

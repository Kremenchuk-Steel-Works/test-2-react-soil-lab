import {
  useCreateTestApiV1TestsPost,
  useDeleteTestApiV1TestsTestIdDelete,
  useGetTestApiV1TestsTestIdGet,
  useGetTestsListApiV1TestsGet,
} from '@/shared/api/soil-lab-2/endpoints/tests/tests'

export const testsService = {
  getList: useGetTestsListApiV1TestsGet,
  getById: useGetTestApiV1TestsTestIdGet,
  create: useCreateTestApiV1TestsPost,
  delete: useDeleteTestApiV1TestsTestIdDelete,
}

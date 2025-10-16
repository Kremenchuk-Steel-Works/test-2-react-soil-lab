import {
  useCreateTestApiV1TestResultsPost,
  useDeleteTestApiV1TestResultsTestResultIdDelete,
  useGetTestApiV1TestResultsTestResultIdGet,
  useGetTestsListApiV1TestResultsGet,
} from '@/shared/api/soil-lab/endpoints/test-results/test-results'

export const testsService = {
  getList: useGetTestsListApiV1TestResultsGet,
  getById: useGetTestApiV1TestResultsTestResultIdGet,
  create: useCreateTestApiV1TestResultsPost,
  delete: useDeleteTestApiV1TestResultsTestResultIdDelete,
}

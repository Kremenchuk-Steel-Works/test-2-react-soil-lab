import {
  useCreateSampleApiV1SamplesPost,
  useDeleteSampleApiV1SamplesSampleIdDelete,
  useGetSampleApiV1SamplesSampleIdGet,
  useGetSamplesListApiV1SamplesGet,
  useGetSamplesReportApiV1SamplesGenerateReportPost,
} from '@/shared/api/soil-lab/endpoints/samples/samples'

export const samplesService = {
  getList: useGetSamplesListApiV1SamplesGet,
  getById: useGetSampleApiV1SamplesSampleIdGet,
  create: useCreateSampleApiV1SamplesPost,
  delete: useDeleteSampleApiV1SamplesSampleIdDelete,
  generateReport: useGetSamplesReportApiV1SamplesGenerateReportPost,
}

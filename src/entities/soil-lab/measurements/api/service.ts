import {
  useCreateMeasurementApiV1MeasurementsPost,
  useDeleteMeasurementApiV1MeasurementsMeasurementIdDelete,
  useGetMeasurementApiV1MeasurementsMeasurementIdGet,
  useGetMeasurementsListApiV1MeasurementsGet,
  useUpdateMeasurementApiV1MeasurementsMeasurementIdPut,
} from '@/shared/api/soil-lab/endpoints/measurements/measurements'

export const measurementsService = {
  getList: useGetMeasurementsListApiV1MeasurementsGet,
  getById: useGetMeasurementApiV1MeasurementsMeasurementIdGet,
  create: useCreateMeasurementApiV1MeasurementsPost,
  update: useUpdateMeasurementApiV1MeasurementsMeasurementIdPut,
  delete: useDeleteMeasurementApiV1MeasurementsMeasurementIdDelete,
}

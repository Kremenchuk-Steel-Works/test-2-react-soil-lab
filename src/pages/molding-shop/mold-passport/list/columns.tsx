import { createColumnHelper } from '@tanstack/react-table'
import { moldPassportStatusOptions } from '@/entities/molding-shop/mold-passport'
import type {
  CastingTechnologyShortResponse,
  MoldingAreaShortResponse,
  MoldPassportListItemResponse,
  MoldPassportListItemResponseMoldingFlask,
  MoldPassportListItemResponsePatternPlateFrame,
} from '@/shared/api/mold-passport/model'
import {
  booleanColumn,
  dateColumn,
  displayColumn,
  idColumn,
  optionColumn,
} from '@/widgets/data-table'

const columnHelper = createColumnHelper<MoldPassportListItemResponse>()

export const moldPassportColumns = [
  columnHelper.accessor('id', {
    header: 'ID',
    ...idColumn(),
  }),

  columnHelper.accessor('isComplete', {
    header: 'Заповнена?',
    size: 145,
    ...booleanColumn(),
  }),

  columnHelper.accessor('primaryCastingProductName', {
    header: 'primaryCastingProductName',
    size: 145,
    ...displayColumn(),
  }),

  columnHelper.accessor('referenceCode', {
    header: 'referenceCode',
    size: 100,
    ...displayColumn(),
  }),

  columnHelper.accessor('markingYear', {
    header: 'Рік маркування',
    size: 155,
    ...displayColumn(),
  }),

  columnHelper.accessor('moldingArea', {
    header: 'Ділянка формовки',
    size: 135,
    ...displayColumn<MoldPassportListItemResponse, MoldingAreaShortResponse>({
      formatter: (cell) => cell.name,
    }),
  }),

  columnHelper.accessor('castingTechnology', {
    header: 'Технологія формовки',
    size: 180,
    ...displayColumn<MoldPassportListItemResponse, CastingTechnologyShortResponse>({
      formatter: (cell) => cell.name,
    }),
  }),

  columnHelper.accessor('patternPlateFrame', {
    header: 'Модельна рамка',
    size: 150,
    ...displayColumn<MoldPassportListItemResponse, MoldPassportListItemResponsePatternPlateFrame>({
      formatter: (cell) => cell?.serialNumber,
    }),
  }),

  columnHelper.accessor('moldingFlask', {
    header: 'Опока',
    size: 150,
    ...displayColumn<MoldPassportListItemResponse, MoldPassportListItemResponseMoldingFlask>({
      formatter: (cell) => cell?.serialNumber,
    }),
  }),

  columnHelper.accessor('moldSequenceInShift', {
    header: 'Номер за зміну',
    size: 115,
    ...displayColumn(),
  }),

  columnHelper.accessor('moldAssemblyTimestamp', {
    header: 'Час складання півформ',
    size: 115,
    ...dateColumn(),
  }),

  columnHelper.accessor('status', {
    header: 'Статус',
    size: 115,
    ...optionColumn(moldPassportStatusOptions),
  }),
]

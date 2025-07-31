import type { Option } from '@/shared/ui/select/ReactSelect'

export const moldExperimentDocumentOptions: Option<string>[] = [
  { value: 'doc1', label: 'Документ 1' },
  { value: 'doc2', label: 'Документ 2' },
  { value: 'doc3', label: 'Документ 3' },
] as const

export type MoldExperimentDocumentOptions = (typeof moldExperimentDocumentOptions)[number]['value']

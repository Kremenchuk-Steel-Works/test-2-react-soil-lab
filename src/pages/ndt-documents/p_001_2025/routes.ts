import { lazy } from 'react'
import { Files, FileText } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'
import SectionLayout from '@/widgets/page-layout/SectionLayout'

const p_001_2025MainPage = lazy(() => import('@/pages/ndt-documents/p_001_2025/ui/Main'))
const Document0014_11_001Page = lazy(
  () => import('@/pages/ndt-documents/p_001_2025/ui/0014_11_001'),
)

export const p_001_2025Routes: AppRoute = {
  key: 'p_001_2025',
  path: 'p_001_2025',
  label: 'П 001-2025',
  icon: Files,
  Component: SectionLayout,
  children: [
    {
      key: '',
      path: '',
      label: '',
      icon: Files,
      Component: p_001_2025MainPage,
    },
    {
      key: '0014_11_001',
      path: '0014_11_001',
      label:
        '0014.11.001 Процедура з проведення магнітопорошкового контролю корпусу букси кресленик ',
      icon: FileText,
      Component: SectionLayout,
      children: [
        {
          key: '',
          path: '',
          label: '',
          icon: FileText,
          Component: Document0014_11_001Page,
        },
      ],
    },
  ],
}

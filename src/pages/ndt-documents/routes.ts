import { lazy } from 'react'
import { Files, FileText } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'
import SectionLayout from '@/widgets/page-layout/SectionLayout'

const NDTDocumentsPageLayout = lazy(() => import('@/pages/ndt-documents/Layout'))
const NDTDocumentsMainPage = lazy(() => import('@/pages/ndt-documents/Main'))
const Document001_2025_0014_11_001Page = lazy(
  () => import('@/pages/ndt-documents/ui/p_001_2025_0014_11_001'),
)

export const ndtDocumentsRoutes: AppRoute = {
  key: 'NDTDocuments',
  path: '/ndt-documents',
  label: 'Документи НК',
  icon: Files,
  Component: NDTDocumentsPageLayout,
  requiredPermissions: ['ndt_documents_view'],
  children: [
    {
      key: 'NDTDocumentsIndex',
      path: '',
      label: '',
      icon: Files,
      Component: NDTDocumentsMainPage,
      inSidebar: false,
    },
    {
      key: 'p_001_2025_0014_11_001',
      path: 'p_001_2025_0014_11_001',
      label:
        'П 001-2025 0014.11.001 Процедура з проведення магнітопорошкового контролю корпусу букси кресленик',
      icon: FileText,
      Component: SectionLayout,
      children: [
        {
          key: '',
          path: '',
          label: '',
          icon: FileText,
          Component: Document001_2025_0014_11_001Page,
          inSidebar: false,
        },
      ],
    },
  ],
}

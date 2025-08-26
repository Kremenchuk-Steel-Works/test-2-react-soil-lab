import { lazy } from 'react'
import { Files } from 'lucide-react'
import type { AppRoute } from '@/app/routes/types'
import { p_001_2025Routes } from '@/pages/ndt-documents/p_001_2025/routes'

const NDTDocumentsPageLayout = lazy(() => import('@/pages/ndt-documents/Layout'))
const NDTDocumentsMainPage = lazy(() => import('@/pages/ndt-documents/Main'))

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
    p_001_2025Routes,
  ],
}

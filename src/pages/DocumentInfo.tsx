import { ImageViewer } from '@/shared/ui/image-view/ImageViewer'
import { PdfViewer } from '@/shared/ui/pdf-view/PdfViewer'
import MainLayout from '@/widgets/page-layout/MainLayout'
import { PageHeader } from '@/widgets/page/PageHeader'

export default function DocumentInfoPage() {
  return (
    <MainLayout>
      <div className="flex flex-1 flex-col space-y-2">
        <PageHeader />
        <ImageViewer
          src={
            '/docs/П 001-2025/П 001-2025 «Процедура з проведення магнітопорошкового контролю корпусу букси кресленик 0014.11.001» Титульний лист.jpg'
          }
          alt="Титульний лист"
        />
        <PdfViewer src="/docs/П 001-2025/П 001-2025 «Процедура з проведення магнітопорошкового контролю корпусу букси кресленик 0014.11.001».pdf" />
      </div>
    </MainLayout>
  )
}

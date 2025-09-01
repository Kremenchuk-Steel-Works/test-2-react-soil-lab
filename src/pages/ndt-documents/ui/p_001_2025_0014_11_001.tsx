import { FileText } from 'lucide-react'
import Button from '@/shared/ui/button/Button'
import { ImageViewer } from '@/shared/ui/image-view/ImageViewer'

export default function Document0014_11_001Page() {
  return (
    <>
      <ImageViewer
        src={
          '/docs/П 001-2025 0014.11.001/П 001-2025 «Процедура з проведення магнітопорошкового контролю корпусу букси кресленик 0014.11.001» Титульний лист.jpg'
        }
        alt="Титульний лист"
      />
      <div>
        <Button className="flex items-center justify-center gap-1 whitespace-nowrap">
          <FileText className="h-5 w-5" />{' '}
          <a
            className="text-layout"
            href="/docs/П 001-2025 0014.11.001/П 001-2025 «Процедура з проведення магнітопорошкового контролю корпусу букси кресленик 0014.11.001».pdf"
          >
            Відкрити PDF
          </a>
        </Button>
      </div>
    </>
  )
}

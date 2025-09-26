import { Download } from 'lucide-react'
import SamplesGenerateReport from '@/features/soil-lab/samples/generate-report/ui/SamplesGenerateReport'
import Button from '@/shared/ui/button/Button'
import { TooltipWrapper } from '@/shared/ui/ellipsis/TooltipWrapper'
import ModalTrigger from '@/shared/ui/modal/ModalTrigger'

export default function SamplesGenerateReportPage() {
  return (
    <ModalTrigger
      trigger={(open) => (
        <TooltipWrapper title={`Завантажити звіт`}>
          <Button
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={open}
          >
            <Download className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </Button>
        </TooltipWrapper>
      )}
      sheetProps={{
        label: <p className="text-lg font-semibold">Завантажити звіт</p>,
      }}
    >
      {({ onSuccess }) => <SamplesGenerateReport onSuccess={onSuccess} />}
    </ModalTrigger>
  )
}

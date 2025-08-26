type PdfViewerProps = {
  /** Абсолютный или относительный URL PDF (на том же домене или с корректными заголовками) */
  src: string
  className?: string
}

export function PdfViewer({ src, className }: PdfViewerProps) {
  return (
    <div className={`h-[100vh] w-full overflow-hidden ${className ?? ''}`}>
      {/* Браузер покажет свой PDF-toolbar внутри этого объекта */}
      <object data={src} type="application/pdf" className="h-full w-full">
        {/* Фолбек только на случай, если встроить не получилось */}
        <div className="p-4 text-sm">
          Помилка при відкритті PDF.{' '}
          <a href={src} target="_blank" rel="noopener noreferrer" className="underline">
            Відкрити у новому вікні
          </a>
          .
        </div>
      </object>
    </div>
  )
}

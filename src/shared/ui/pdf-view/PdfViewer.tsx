import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Настройка воркера PDF.js для Vite (ESM)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

type PdfViewerProps = {
  /** Абсолютный или относительный URL PDF (на том же домене или с корректными заголовками) */
  src: string
  className?: string
}

/** Простая проверка мобильных UA. Нам не нужна 100% точность — только переключатель стратегии. */
function isMobileUA(ua: string) {
  return /Android|iPhone|iPad|iPod/i.test(ua)
}

/** Хук измерения контейнера для адаптивной ширины canvas-страниц */
function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect
      if (cr) setSize({ width: Math.floor(cr.width), height: Math.floor(cr.height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return [ref, size] as const
}

export function PdfViewer({ src, className }: PdfViewerProps) {
  const [forcePdfJs, setForcePdfJs] = useState(false)

  // На мобилках сразу рендерим через PDF.js
  useEffect(() => {
    setForcePdfJs(isMobileUA(navigator.userAgent))
  }, [])

  if (!forcePdfJs) {
    // Десктоп: даём браузеру шанс отобразить PDF нативно
    return (
      <div className={`h-[100vh] w-full overflow-hidden ${className ?? ''}`}>
        <object data={src} type="application/pdf" className="h-full w-full">
          {/* Попытка через iframe — иногда помогает, если объект не сработал */}
          <iframe title="pdf-fallback" src={src} className="h-full w-full" />
          {/* Финальный фолбек — ссылка в новую вкладку */}
          <div className="p-4 text-sm">
            Помилка при відкритті PDF.{` `}
            <a href={src} target="_blank" rel="noopener noreferrer" className="underline">
              Відкрити у новому вікні
            </a>
            .
          </div>
        </object>
      </div>
    )
  }

  return <PdfJsViewer src={src} className={className} />
}

function PdfJsViewer({ src, className }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [containerRef, { width: containerWidth }] = useElementSize<HTMLDivElement>()

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setError(null)
    setPage(1)
  }, [])

  const onLoadError = useCallback((err: Error) => {
    setError(err.message || 'Failed to load PDF')
  }, [])

  // Максимальная ширина страницы — ширина контейнера; высота не задаём — Page сам посчитает.
  const pageWidth = useMemo(() => {
    // небольшой отступ под скроллбар/паддинги
    return Math.max(320, Math.floor((containerWidth || 0) - 8))
  }, [containerWidth])

  return (
    <div className={`flex h-[100vh] w-full flex-col ${className ?? ''}`}>
      {/* Панель действий */}
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-white/80 px-3 py-2 shadow backdrop-blur">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="rounded-2xl bg-gray-100 px-3 py-1 text-sm shadow disabled:opacity-50"
        >
          ← Пред.
        </button>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(numPages || p, p + 1))}
          disabled={!numPages || page >= numPages}
          className="rounded-2xl bg-gray-100 px-3 py-1 text-sm shadow disabled:opacity-50"
        >
          След. →
        </button>

        <div className="ml-2 text-sm text-gray-700">
          Стр. {page}
          {numPages ? ` / ${numPages}` : ''}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-indigo-600 px-3 py-1 text-sm text-white shadow"
          >
            Открыть в новой вкладке
          </a>
          <a
            href={src}
            download
            className="rounded-2xl bg-gray-800 px-3 py-1 text-sm text-white shadow"
          >
            Скачать
          </a>
        </div>
      </div>

      {/* Область рендера */}
      <div ref={containerRef} className="flex-1 overflow-auto bg-gray-50 p-2">
        <Document
          file={{ url: src }}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={<Loader />}
          error={<ErrorView src={src} message={error ?? 'Помилка при відкритті PDF.'} />}
        >
          {/* pageWidth может быть 0 в первый рендер — не рендерим Page до измерения */}
          {pageWidth > 0 && (
            <Page
              pageNumber={page}
              width={pageWidth}
              renderTextLayer
              renderAnnotationLayer
              loading={<Loader />}
            />
          )}
        </Document>

        {/* Если Document отдала ошибку (например, CORS) — покажем fallback */}
        {error && <ErrorView src={src} message={error} />}
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="flex h-40 items-center justify-center text-gray-500">Завантаження PDF…</div>
  )
}

function ErrorView({ src, message }: { src: string; message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}.{' '}
      <a href={src} target="_blank" rel="noopener noreferrer" className="underline">
        Відкрити у новому вікні
      </a>
      .
    </div>
  )
}

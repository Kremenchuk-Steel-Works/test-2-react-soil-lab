import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// ✅ Vite-способ: создаём модульный worker прямо из пакета (v4, ESM)
function setupPdfWorker() {
  if (typeof window === 'undefined') return
  // 1) Предпочтительно — задать готовый Worker (устойчиво на мобилках)
  try {
    const worker = new Worker(new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url), {
      type: 'module',
    })
    // Передаём инстанс воркера напрямую (минуем auto-резолв путей)
    ;(pdfjs as any).GlobalWorkerOptions.workerPort = worker
    return
  } catch {
    // 2) Фолбек: просто URL (тоже работает в Vite, если сервер отдаёт .mjs корректно)
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString()
  }
}

type PdfViewerProps = {
  src: string
  className?: string
}

function isMobileUA(ua: string) {
  return /Android|iPhone|iPad|iPod/i.test(ua)
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect
      if (cr) setSize({ width: Math.floor(cr.width), height: Math.floor(cr.height) })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

export function PdfViewer({ src, className }: PdfViewerProps) {
  const [forcePdfJs, setForcePdfJs] = useState(false)
  useEffect(() => {
    setupPdfWorker()
    setForcePdfJs(isMobileUA(navigator.userAgent))
  }, [])

  if (!forcePdfJs) {
    return (
      <div className={`h-[100vh] w-full overflow-hidden ${className ?? ''}`}>
        <object data={encodeURI(src)} type="application/pdf" className="h-full w-full">
          <iframe title="pdf-fallback" src={encodeURI(src)} className="h-full w-full" />
          <div className="p-4 text-sm">
            Помилка при відкритті PDF.{` `}
            <a
              href={encodeURI(src)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
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
  const onLoadError = useCallback((err: Error) => setError(err.message || 'Failed to load PDF'), [])

  const pageWidth = useMemo(
    () => Math.max(320, Math.floor((containerWidth || 0) - 8)),
    [containerWidth],
  )

  return (
    <div className={`flex h-[100vh] w-full flex-col ${className ?? ''}`}>
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-white/80 px-3 py-2 shadow backdrop-blur">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="rounded-2xl bg-gray-100 px-3 py-1 text-sm shadow disabled:opacity-50"
        >
          ← Пред.
        </button>
        <button
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
            href={encodeURI(src)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-indigo-600 px-3 py-1 text-sm text-white shadow"
          >
            Открыть в новой вкладке
          </a>
          <a
            href={encodeURI(src)}
            download
            className="rounded-2xl bg-gray-800 px-3 py-1 text-sm text-white shadow"
          >
            Скачать
          </a>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto bg-gray-50 p-2">
        <Document
          file={{ url: encodeURI(src) }}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={<Loader />}
          error={<ErrorView src={src} message={error ?? 'Помилка при відкритті PDF.'} />}
        >
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
      <a href={encodeURI(src)} target="_blank" rel="noopener noreferrer" className="underline">
        Відкрити у новому вікні
      </a>
      .
    </div>
  )
}

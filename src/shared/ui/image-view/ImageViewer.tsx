import { useCallback, useEffect, useMemo, useRef, useState, type PointerEventHandler } from 'react'
import { Download, Minus, Plus, Printer, RotateCcw } from 'lucide-react'
import { toSafeUrl } from '@/shared/lib/url/toSafeUrl'

type Point = { x: number; y: number }

type ImageViewerProps = {
  src: string
  alt?: string
  className?: string
  minScale?: number
  maxScale?: number
  step?: number
}

/** Хук для media-query, безопасен для SSR и без флика в большинстве случаев */
function useMediaQuery(query: string) {
  const getInitial = () =>
    typeof window !== 'undefined' && 'matchMedia' in window
      ? window.matchMedia(query).matches
      : false

  const [matches, setMatches] = useState(getInitial)

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)

    // совместимость со старыми Safari
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange)
    } else {
      mql.addListener(onChange) // устаревший API, оставлен как фолбэк
    }

    setMatches(mql.matches)

    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', onChange)
      } else {
        mql.removeListener(onChange) // устаревший API, оставлен как фолбэк
      }
    }
  }, [query])

  return matches
}

/** Обёртка: выбирает мобильную/десктопную версию. Здесь всегда одинаковое число хуков. */
export function ImageViewer(props: ImageViewerProps) {
  const isPhoneTouch = useMediaQuery('(pointer: coarse) and (max-width: 768px)')
  return isPhoneTouch ? <ImageViewerMobile {...props} /> : <ImageViewerDesktop {...props} />
}

/** Мобильная версия — только картинка, нативные жесты. */
function ImageViewerMobile({ src, alt = 'Зображення', className }: ImageViewerProps) {
  const safe = useMemo(() => toSafeUrl(src), [src])

  return (
    <figure className={`relative ${className ?? ''}`}>
      <img
        src={safe}
        alt={alt}
        className="block w-full object-contain select-none"
        style={{ maxHeight: '75vh' }}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).alt = 'Не вдалося завантажити зображення'
        }}
      />
    </figure>
  )
}

/** Десктопная версия — зум/панорамирование и тулбар. */
function ImageViewerDesktop({
  src,
  alt = 'Зображення',
  className,
  minScale = 0.5,
  maxScale = 5,
  step = 0.2,
}: ImageViewerProps) {
  const safe = useMemo(() => toSafeUrl(src), [src])

  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const panningRef = useRef({ active: false, startX: 0, startY: 0 })

  const clamp = useCallback((v: number, a: number, b: number) => Math.min(b, Math.max(a, v)), [])

  // Зум с учётом точки наведения
  const zoomBy = useCallback(
    (delta: number, pivot?: Point) => {
      setScale((prev) => {
        const next = clamp(prev + delta, minScale, maxScale)
        if (pivot && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const cx = pivot.x - rect.left
          const cy = pivot.y - rect.top
          const k = next / prev
          setOffset((o) => ({ x: cx - (cx - o.x) * k, y: cy - (cy - o.y) * k }))
        }
        return next
      })
    },
    [clamp, maxScale, minScale],
  )

  const onPointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== 0) return // только ЛКМ
    panningRef.current.active = true
    panningRef.current.startX = e.clientX - offset.x
    panningRef.current.startY = e.clientY - offset.y
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!panningRef.current.active) return
    setOffset({
      x: e.clientX - panningRef.current.startX,
      y: e.clientY - panningRef.current.startY,
    })
  }

  const stopPan: PointerEventHandler<HTMLDivElement> = (e) => {
    panningRef.current.active = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const reset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const fileName = useMemo(() => {
    try {
      const u = new URL(
        safe,
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
      )
      const last = u.pathname.split('/').pop() || 'image.jpg'
      return decodeURIComponent(last)
    } catch {
      return 'image.jpg'
    }
  }, [safe])

  const handlePrint = useCallback(() => {
    if (typeof window === 'undefined') return

    const iframe = document.createElement('iframe')
    Object.assign(iframe.style, {
      position: 'fixed',
      visibility: 'hidden',
      width: '0',
      height: '0',
      border: '0',
    } as CSSStyleDeclaration)

    iframe.srcdoc = `
    <!doctype html><html><head><meta charset="utf-8" />
    <style>
      @page { margin: 0; }
      html,body { height:100%; margin:0; }
      body { display:flex; align-items:center; justify-content:center; }
      img { max-width:100vw; max-height:100vh; }
    </style>
    </head><body></body></html>`

    iframe.onload = () => {
      const win = iframe.contentWindow
      if (!win) {
        iframe.remove()
        return
      }

      // Назначаем обработчик onafterprint
      win.onafterprint = () => {
        iframe.remove()
      }

      const doc = win.document
      const img = doc.createElement('img')

      img.onload = () => {
        win.focus()
        setTimeout(() => win.print(), 50)
      }
      img.onerror = () => iframe.remove()
      doc.body.appendChild(img)
      img.src = safe
      if (img.complete) {
        // уже закэшировано — вручную триггерим
        img.onload?.(new Event('load'))
      }

      img.onerror = () => {
        iframe.remove()
      }

      doc.body.appendChild(img)
      img.src = safe
    }

    document.body.appendChild(iframe)
  }, [safe])

  const toolbarBtn =
    'h-9 w-9 grid place-items-center rounded-md transition ' +
    'bg-gray-200 hover:bg-gray-300 text-slate-700 ' +
    'dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-slate-300 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'

  return (
    <figure className={`relative overflow-hidden ${className ?? ''}`}>
      {/* Тулбар (десктоп) */}
      <div
        className="pointer-events-auto absolute top-2 right-2 z-10 flex items-center gap-1 rounded-xl px-1.5 py-1 shadow-md backdrop-blur"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          title="Зменшити"
          aria-label="Зменшити"
          onClick={() => zoomBy(-step)}
          className={toolbarBtn}
        >
          <Minus className="h-4 w-4" />
        </button>

        <button
          type="button"
          title="Збільшити"
          aria-label="Збільшити"
          onClick={() => zoomBy(step)}
          className={toolbarBtn}
        >
          <Plus className="h-4 w-4" />
        </button>

        <div
          className="grid h-9 min-w-12 place-items-center rounded-md bg-gray-200 px-2 text-sm font-medium text-slate-700 dark:bg-gray-700 dark:text-slate-300"
          aria-label="Поточний масштаб"
          role="status"
        >
          {Math.round(scale * 100)}%
        </div>

        <button
          type="button"
          title="Скинути масштаб"
          aria-label="Скинути масштаб"
          onClick={reset}
          className={toolbarBtn}
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          type="button"
          title="Друк"
          aria-label="Друк"
          onClick={handlePrint}
          className={toolbarBtn}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Printer className="h-4 w-4" />
        </button>

        <a
          href={safe}
          download={fileName}
          title="Завантажити"
          aria-label="Завантажити"
          className={toolbarBtn + ' text-center'}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Download className="h-4 w-4" />
        </a>
      </div>

      {/* Полотно перегляду (десктоп) */}
      <div
        ref={containerRef}
        className={`relative w-full select-none ${panningRef.current.active ? 'cursor-grabbing' : 'cursor-grab'} h-[60vh] sm:h-[70vh] lg:h-[75vh]`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopPan}
        onPointerCancel={stopPan}
        onPointerLeave={stopPan}
        // жесты внутри вьюера — не прокручиваем страницу
        style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
      >
        <img
          src={safe}
          alt={alt}
          className="pointer-events-none select-none"
          draggable={false}
          loading="lazy"
          decoding="async"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            maxWidth: '100%',
            maxHeight: '100%',
            position: 'absolute',
            left: '50%',
            top: '50%',
            translate: '-50% -50%',
            userSelect: 'none',
          }}
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).alt = 'Не вдалося завантажити зображення'
          }}
        />
      </div>
    </figure>
  )
}

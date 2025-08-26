import * as React from 'react'
import { Download, Minus, Plus, RotateCcw } from 'lucide-react'
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

export function ImageViewer({
  src,
  alt = 'Зображення',
  className,
  minScale = 0.5,
  maxScale = 5,
  step = 0.2,
}: ImageViewerProps) {
  const safe = React.useMemo(() => toSafeUrl(src), [src])

  const [scale, setScale] = React.useState(1)
  const [offset, setOffset] = React.useState<Point>({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)
  const panningRef = React.useRef({ active: false, startX: 0, startY: 0 })

  const clamp = React.useCallback(
    (v: number, a: number, b: number) => Math.min(b, Math.max(a, v)),
    [],
  )

  // Зум с учётом точки наведения
  const zoomBy = React.useCallback(
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

  const onWheel = (e: React.WheelEvent) => {
    // Чтобы не ломать прокрутку страницы — зум только при Ctrl/Cmd
    if (!e.ctrlKey && !e.metaKey) return
    e.preventDefault()
    const dir = -Math.sign(e.deltaY)
    zoomBy(dir * step, { x: e.clientX, y: e.clientY })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    panningRef.current.active = true
    panningRef.current.startX = e.clientX - offset.x
    panningRef.current.startY = e.clientY - offset.y
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!panningRef.current.active) return
    setOffset({
      x: e.clientX - panningRef.current.startX,
      y: e.clientY - panningRef.current.startY,
    })
  }
  const stopPan = (e: React.PointerEvent) => {
    panningRef.current.active = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
  }

  const reset = React.useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const fileName = React.useMemo(() => {
    try {
      const u = new URL(safe, window.location.origin)
      const last = u.pathname.split('/').pop() || 'image.jpg'
      return decodeURIComponent(last)
    } catch {
      return 'image.jpg'
    }
  }, [safe])

  const toolbarBtn =
    'h-9 w-9 grid place-items-center rounded-md transition ' +
    'bg-gray-200 hover:bg-gray-300 text-slate-700 ' +
    'dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-slate-300 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'

  return (
    <figure className={`relative overflow-hidden ${className ?? ''}`}>
      {/* Тулбар */}
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

        {/* Индикатор масштаба */}
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

      {/* Полотно перегляду */}
      <div
        ref={containerRef}
        className={`relative w-full touch-pan-y select-none ${panningRef.current.active ? 'cursor-grabbing' : 'cursor-grab'} h-[60vh] sm:h-[70vh] lg:h-[75vh]`}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopPan}
        onPointerCancel={stopPan}
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
            translate: '-50% -50%', // центрування
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

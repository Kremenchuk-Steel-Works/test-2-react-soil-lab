import * as React from 'react'
import { toSafeUrl } from '@/shared/lib/url/toSafeUrl'

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
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  const containerRef = React.useRef<HTMLDivElement>(null)
  const panningRef = React.useRef({ active: false, startX: 0, startY: 0 })

  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

  // зум (з урахуванням точки наведення, якщо є)
  const zoomBy = (delta: number, pivot?: { x: number; y: number }) => {
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
  }

  const onWheel = (e: React.WheelEvent) => {
    // Щоб не заважати прокрутці сторінки — зум працює при Ctrl/Cmd
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

  const reset = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const fileName = React.useMemo(() => {
    try {
      const u = new URL(safe, window.location.origin)
      const last = u.pathname.split('/').pop() || 'image.jpg'
      return decodeURIComponent(last)
    } catch {
      return 'image.jpg'
    }
  }, [safe])

  return (
    <figure className={`relative overflow-hidden ${className ?? ''}`}>
      {/* тулбар */}
      <div
        className="pointer-events-auto absolute top-2 right-2 z-10 flex items-center gap-2 rounded-xl bg-black/50 p-1 backdrop-blur"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          title="Зменшити"
          aria-label="Зменшити"
          onClick={() => zoomBy(-step)}
          className="h-9 w-9 cursor-pointer text-sm font-medium"
        >
          −
        </button>
        <button
          type="button"
          title="Збільшити"
          aria-label="Збільшити"
          onClick={() => zoomBy(step)}
          className="h-9 w-9 cursor-pointer text-sm font-medium"
        >
          +
        </button>
        <button
          type="button"
          title="Скинути масштаб"
          aria-label="Скинути масштаб"
          onClick={reset}
          className="h-9 w-9 cursor-pointer text-sm font-medium"
        >
          ⟲
        </button>
        <a
          href={safe}
          download={fileName}
          title="Завантажити"
          aria-label="Завантажити"
          className="h-9 w-9 cursor-pointer text-center leading-9"
          onPointerDown={(e) => e.stopPropagation()}
        >
          ⬇
        </a>
      </div>

      {/* полотно перегляду */}
      <div
        ref={containerRef}
        className="relative h-[80vh] w-full touch-pan-y"
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

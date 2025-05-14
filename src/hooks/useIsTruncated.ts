import { useState, useEffect, useRef } from "react"

export function useIsTruncated<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (el) {
      setIsTruncated(el.scrollWidth > el.offsetWidth)
    }
  }, [ref.current])

  return { ref, isTruncated }
}

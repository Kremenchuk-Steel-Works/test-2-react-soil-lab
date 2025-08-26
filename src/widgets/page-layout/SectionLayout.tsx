import { Outlet } from 'react-router-dom'

/**
 * Внутренний Layout.
 */
export default function SectionLayout() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <Outlet />
    </div>
  )
}

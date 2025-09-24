import { Outlet } from 'react-router-dom'

export default function MeasurementsLayout() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <Outlet />
    </div>
  )
}

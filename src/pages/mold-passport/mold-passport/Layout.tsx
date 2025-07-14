import { Outlet } from 'react-router-dom'

export default function MoldPassportLayout() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="flex items-center justify-between"></div>
      <Outlet />
    </div>
  )
}

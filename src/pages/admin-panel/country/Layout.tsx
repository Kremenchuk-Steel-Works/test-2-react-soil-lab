import { Outlet } from 'react-router-dom'

export default function AdminCountryLayout() {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="layout-text">Країни</h4>
      </div>
      <Outlet />
    </div>
  )
}

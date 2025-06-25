import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes/routes'
import Button from '@/shared/ui/button/Button'

export default function AdminPanelMain() {
  const navigate = useNavigate()
  const adminRoute = APP_ROUTES.find((route) => route.key === 'admin')
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="flex items-center justify-between">
        {adminRoute?.children && (
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            {adminRoute?.children
              .filter((childRoute) => childRoute.children && childRoute.children.length > 0)
              .map((childRoute) => (
                <Button
                  key={childRoute.key}
                  className="flex items-center justify-center gap-1 whitespace-nowrap"
                  onClick={() => navigate(childRoute.path)}
                >
                  <childRoute.icon className="h-5 w-5" /> <span>{childRoute.label}</span>
                </Button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

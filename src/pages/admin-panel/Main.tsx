import { useNavigate } from "react-router-dom"
import Button from "../../shared/ui/Button/Button"
import { APP_ROUTES } from "../../app/routes/routes.config"

export default function AdminPanelMain() {
  const navigate = useNavigate()
  const adminRoute = APP_ROUTES.find((route) => route.key === "admin")
  return (
    <div className="flex flex-col flex-1 space-y-2">
      <div className="flex justify-between items-center">
        {adminRoute?.children && (
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            {adminRoute?.children
              .filter(
                (childRoute) =>
                  childRoute.children && childRoute.children.length > 0
              )
              .map((childRoute) => (
                <Button
                  key={childRoute.key}
                  className="flex items-center justify-center gap-1 whitespace-nowrap"
                  onClick={() => navigate(childRoute.path)}
                >
                  <childRoute.icon className="w-5 h-5" />{" "}
                  <span>{childRoute.label}</span>
                </Button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

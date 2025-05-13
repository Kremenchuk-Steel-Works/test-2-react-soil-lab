import type { LucideIcon } from "lucide-react"
import MenuItem from "./MenuItem"

interface SubMenuItemProps {
  label: string
  Icon?: LucideIcon
  to: string
}

export function SubMenuItem({ label, Icon, to }: SubMenuItemProps) {
  return Icon ? (
    <MenuItem label={label} to={to} Icon={Icon} />
  ) : (
    <MenuItem label={label} to={to} />
  )
}

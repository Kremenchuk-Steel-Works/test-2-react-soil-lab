import type { LucideIcon } from "lucide-react"
import { SubMenu } from "./SubMenu"

interface SubMenuProps {
  label: string
  Icon: LucideIcon
  children: React.ReactNode
}

export const SubMenuSubItem: React.FC<SubMenuProps> = ({
  label,
  Icon,
  children,
}) => {
  return SubMenu({ label, Icon, children })
}

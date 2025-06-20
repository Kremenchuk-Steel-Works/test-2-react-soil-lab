import type { LucideIcon } from 'lucide-react'
import { SubMenu } from '@/widgets/sidebar/SubMenu'

interface SubMenuProps {
  label: string
  Icon: LucideIcon
  children: React.ReactNode
  id: string
  isMainMenu?: boolean
}

export const SubMenuSubItem: React.FC<SubMenuProps> = ({ label, Icon, children, id }) => {
  return (
    <SubMenu label={label} Icon={Icon} id={id} isMainMenu={false}>
      <div className="bg-[#e2edfe] dark:bg-[#0c121f] [&_a]:pl-11.5 [&_button]:pl-11.5">
        {children}
      </div>
    </SubMenu>
  )
}

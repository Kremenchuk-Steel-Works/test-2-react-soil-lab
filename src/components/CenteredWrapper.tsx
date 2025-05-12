interface CenteredWrapperProps {
  children: React.ReactNode
}

export const CenteredWrapper: React.FC<CenteredWrapperProps> = ({
  children,
}) => {
  return (
    <div
      className="
        fixed inset-0
        flex items-center justify-center
        p-4
        z-50
        pointer-events-none
      "
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  )
}

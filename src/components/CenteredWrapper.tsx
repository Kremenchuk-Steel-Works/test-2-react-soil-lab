interface CenteredWrapperProps {
  children: React.ReactNode
}

export const CenteredWrapper: React.FC<CenteredWrapperProps> = ({
  children,
}) => {
  return (
    <div className="flex items-center justify-center h-full w-full p-4">
      <div className="pointer-events-auto">{children}</div>
    </div>
  )
}

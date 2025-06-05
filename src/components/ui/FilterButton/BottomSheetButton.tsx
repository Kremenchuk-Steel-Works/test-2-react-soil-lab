import React, { useState, useCallback } from "react"
import Button from "../../Button/Button"
import BottomSheet from "../BottomSheet/BottomSheet"

interface BottomSheetButtonProps {
  label: React.ReactNode
  buttonProps?: React.ComponentPropsWithoutRef<"button">
  sheetProps?: Omit<
    React.ComponentProps<typeof BottomSheet>,
    "isOpen" | "onClose" | "children"
  >
  children:
    | React.ReactNode
    | ((props: { onSuccess: () => void }) => React.ReactNode)
}

const BottomSheetButton: React.FC<BottomSheetButtonProps> = ({
  label,
  buttonProps,
  sheetProps,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const renderChildren = () => {
    if (typeof children === "function") {
      return children({ onSuccess: close })
    }
    return children
  }

  return (
    <>
      <Button onClick={open} {...buttonProps}>
        {label}
      </Button>
      <BottomSheet isOpen={isOpen} onClose={close} {...sheetProps}>
        {renderChildren()}
      </BottomSheet>
    </>
  )
}

export default BottomSheetButton

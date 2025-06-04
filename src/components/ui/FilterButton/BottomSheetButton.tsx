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
  children: React.ReactNode
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

  return (
    <>
      <Button onClick={open} {...buttonProps}>
        {label}
      </Button>
      <BottomSheet isOpen={isOpen} onClose={close} {...sheetProps}>
        {children}
      </BottomSheet>
    </>
  )
}

export default BottomSheetButton

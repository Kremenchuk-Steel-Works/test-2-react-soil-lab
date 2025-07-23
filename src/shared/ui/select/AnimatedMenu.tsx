import type { CSSProperties } from 'react'
import { AnimatePresence, motion, type Transition, type Variants } from 'framer-motion'
import { type GroupBase, type MenuProps } from 'react-select'

const menuVariants: Variants = {
  hidden: {
    opacity: 1,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: 'auto',
  },
}

const menuTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
}

function AnimatedMenu<
  OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>(props: MenuProps<OptionType, IsMulti, Group>) {
  const { children, className, cx, getStyles, innerProps, selectProps } = props

  const baseMenuStyles = getStyles('menu', props)
  const { transition, ...safeStyles } = baseMenuStyles as CSSProperties

  const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...safeInnerProps } = innerProps

  return (
    <AnimatePresence>
      {selectProps.menuIsOpen && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={menuTransition}
          {...safeInnerProps}
          className={cx(
            { menu: true },
            'mt-1 rounded-md border p-0 shadow-lg',
            'border-gray-200 bg-white',
            'dark:border-gray-700 dark:bg-gray-700',
            className,
          )}
          style={{
            ...safeStyles,
            overflow: 'hidden',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedMenu

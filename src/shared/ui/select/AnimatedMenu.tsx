import type { CSSProperties, HTMLAttributes } from 'react'
import { AnimatePresence, motion, type Transition, type Variants } from 'framer-motion'
import { type GroupBase, type MenuProps } from 'react-select'

const menuVariants: Variants = {
  hidden: { opacity: 1, height: 0 },
  visible: { opacity: 1, height: 'auto' },
}

const menuTransition: Transition = { duration: 0.2, ease: 'easeOut' }

// Универсальный omit с корректным типом результата
const omit = <T extends object, K extends readonly (keyof T)[]>(
  obj: T,
  keys: K,
): Omit<T, K[number]> => {
  const clone: Record<string, unknown> = { ...(obj as Record<string, unknown>) }
  for (const k of keys) delete clone[k as string]
  return clone as Omit<T, K[number]>
}

function AnimatedMenu<
  OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>,
>(props: MenuProps<OptionType, IsMulti, Group>) {
  const { children, className, cx, getStyles, innerProps, selectProps } = props

  // Убираем transition из inline-стилей (его задаёт framer-motion)
  const baseMenuStyles = getStyles('menu', props) as CSSProperties
  const safeStyles = omit(baseMenuStyles, ['transition'] as const)

  // Фильтруем конфликтующие DOM-события, чтобы совпадающие имена подошли по типу motion.div
  const rawInner = innerProps as HTMLAttributes<HTMLDivElement>
  const safeInnerProps = omit(rawInner, [
    'onAnimationStart',
    'onDrag',
    'onDragStart',
    'onDragEnd',
  ] as const)

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
          style={{ ...safeStyles, overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedMenu

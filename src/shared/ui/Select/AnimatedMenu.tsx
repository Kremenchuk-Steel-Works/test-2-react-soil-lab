import { components, type GroupBase, type MenuProps } from "react-select"
import { motion, AnimatePresence } from "framer-motion"

function AnimatedMenu<
  OptionType,
  IsMulti extends boolean = false,
  Group extends GroupBase<OptionType> = GroupBase<OptionType>
>(props: MenuProps<OptionType, IsMulti, Group>) {
  return (
    <AnimatePresence>
      {props.selectProps.menuIsOpen && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 0, scale: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ position: "absolute", width: "100%", zIndex: 1 }}
        >
          <components.Menu {...props}>{props.children}</components.Menu>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedMenu

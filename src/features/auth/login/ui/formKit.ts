import type { LoginFormFields } from '@/features/auth/login/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const LoginFormKit = createFormKit<LoginFormFields>()

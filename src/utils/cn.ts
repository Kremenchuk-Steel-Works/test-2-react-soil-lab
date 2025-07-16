import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Объединение классов с использованием clsx и twMerge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

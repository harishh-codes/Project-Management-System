import { cva } from 'class-variance-authority'
import { cn } from '../lib/cn'

const button = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-blue-600',
        secondary: 'bg-secondary text-white hover:bg-green-600',
        danger: 'bg-danger text-white hover:bg-red-600',
        warning: 'bg-warning text-white hover:bg-amber-600',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
        ghost: 'text-primary hover:bg-blue-50',
        'gradient-primary': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:scale-105',
        'gradient-secondary': 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg hover:from-teal-600 hover:to-cyan-700 hover:scale-105',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export default function Button({ children, variant, size, isLoading = false, className, ...props }) {
  return (
    <button className={cn(button({ variant, size }), className)} disabled={props.disabled || isLoading} {...props}>
      {isLoading ? 'Loading...' : children}
    </button>
  )
}

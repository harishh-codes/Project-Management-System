import { cn } from '../lib/cn'

export default function Card({ children, className = '' }) {
  return (
    <div className={cn('bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200', className)}>
      {children}
    </div>
  )
}

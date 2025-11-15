import { cn } from '../lib/cn'

export default function Input({ label, type = 'text', name, value, onChange, error, placeholder = '', required = false, disabled = false, className = '' }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}{required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-2 rounded-md border focus:outline-none transition-shadow',
          error ? 'border-danger focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-primary/30',
          disabled ? 'bg-gray-100' : 'bg-white',
          className
        )}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  )
}

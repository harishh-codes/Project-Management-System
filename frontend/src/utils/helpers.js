import { toast } from 'react-toastify'

export const handleAxiosError = (error, fallbackMessage = 'Something went wrong') => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage

  toast.error(message)
  return message
}

export const handleAxiosSuccess = (message = 'Success') => {
  toast.success(message)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatError = (errors) => {
  if (typeof errors === 'string') return errors
  if (Array.isArray(errors)) {
    return errors
      .map(err => {
        if (typeof err === 'object') {
          return Object.values(err).join(', ')
        }
        return err
      })
      .join('; ')
  }
  if (typeof errors === 'object') {
    return Object.values(errors).join('; ')
  }
  return 'An error occurred'
}

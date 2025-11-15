import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

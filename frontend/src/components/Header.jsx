import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearAuth } from '../store/authSlice'
import { authAPI } from '../api'
import { handleAxiosError, handleAxiosSuccess } from '../utils/helpers'
import { UserIcon } from 'lucide-react'
import { cn } from '../lib/cn'
import * as Popover from '@radix-ui/react-popover'

export default function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      dispatch(clearAuth())
      handleAxiosSuccess('Logged out successfully')
      navigate('/login')
    } catch (error) {
      handleAxiosError(error)
      dispatch(clearAuth())
      navigate('/login')
    }
  }

  const NavLink = ({ to, children }) => (
    <Link to={to} className="group relative px-1 py-2 text-sm text-gray-700 font-medium transition hover:text-primary">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
    </Link>
  )

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-primary via-indigo-600 to-secondary bg-clip-text text-transparent hover:opacity-80 transition">
            📊 PM
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>
            {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
                <UserIcon size={18} className="text-gray-700" />
              </button>
            </Popover.Trigger>
            <Popover.Content sideOffset={8} className="z-50 rounded-lg bg-white p-3 shadow-lg border border-gray-200 w-56">
              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="font-semibold text-gray-800 text-sm">{user?.fullName || user?.username}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Link to="/profile" className="px-3 py-2 rounded-md hover:bg-blue-50 text-sm text-gray-700 hover:text-primary transition-colors">View Profile</Link>
                <Link to="/profile" className="px-3 py-2 rounded-md hover:bg-blue-50 text-sm text-gray-700 hover:text-primary transition-colors">Edit Profile</Link>
                <button onClick={handleLogout} className="text-left px-3 py-2 rounded-md hover:bg-red-50 text-sm text-danger hover:text-red-700 transition-colors">Logout</button>
              </div>
              <Popover.Arrow className="fill-white" />
            </Popover.Content>
          </Popover.Root>
        </div>
      </nav>
    </header>
  )
}

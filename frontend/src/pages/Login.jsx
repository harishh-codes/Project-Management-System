import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser, setTokens } from '../store/authSlice'
import { authAPI } from '../api'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import { handleAxiosError, handleAxiosSuccess } from '../utils/helpers'

import { LogIn, Mail, Lock } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      })

      const { user, accessToken, refreshToken } = response.data.data
      dispatch(setUser(user))
      dispatch(setTokens({ accessToken, refreshToken }))

      handleAxiosSuccess('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full py-6 px-6 rounded-2xl shadow-xl">

        {/* Header Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-10 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
              required
              className="pl-10"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-10 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••"
              required
              className="pl-10"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <Button
            type="submit"
            isLoading={loading}
            variant="gradient-primary"
            size="lg"
            className="w-full mt-6 rounded-xl shadow-md hover:shadow-xl transition-all"
          >
            Sign In
          </Button>
        </form>

        {/* Register link */}
        <p className="text-center text-gray-600 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser, setTokens } from '../store/authSlice'
import { authAPI } from '../api'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import { handleAxiosError, handleAxiosSuccess } from '../utils/helpers'

import { User, Mail, Lock, UserPlus } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
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
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
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
      await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      })

      handleAxiosSuccess('Registration successful! Please check your email to verify your account.')
      navigate('/login')
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full py-6 px-6 rounded-2xl shadow-xl">
        
        {/* Heading with Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">Create Account</h2>
        <p className="text-center text-gray-600 mb-6">Join Project Manager today</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-10 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="pl-10"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-10 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="johndoe"
              required
              className="pl-10"
            />
          </div>

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
              placeholder="john@example.com"
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

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-10 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••"
              required
              className="pl-10"
            />
          </div>

          {/* Button */}
          <Button
            type="submit"
            isLoading={loading}
            variant="gradient-primary"
            size="lg"
            className="w-full mt-6 rounded-xl shadow-lg hover:shadow-2xl transition-all"
          >
            Sign Up
          </Button>
        </form>

        {/* Switch to Login */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  )
}

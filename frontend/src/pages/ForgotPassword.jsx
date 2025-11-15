import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'
import { handleAxiosError, handleAxiosSuccess } from '../utils/helpers'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // email, reset
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [resetData, setResetData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const handleRequestReset = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setErrors({ email: 'Email is required' })
      return
    }

    setLoading(true)
    try {
      await authAPI.forgotPassword({ email })
      handleAxiosSuccess('Reset link sent to your email!')
      setStep('reset')
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!resetData.token.trim()) newErrors.token = 'Reset token is required'
    if (!resetData.newPassword) newErrors.newPassword = 'Password is required'
    if (resetData.newPassword !== resetData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await authAPI.resetPassword(resetData.token, {
        newPassword: resetData.newPassword,
        confirmNewPassword: resetData.confirmPassword,
      })
      handleAxiosSuccess('Password reset successfully!')
      navigate('/login')
    } catch (error) {
      handleAxiosError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">
          {step === 'email' ? 'Enter your email to receive a reset link' : 'Enter the reset token and your new password'}
        </p>

        {step === 'email' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({})
              }}
              error={errors.email}
              placeholder="you@example.com"
              required
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full"
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Input
              label="Reset Token"
              type="text"
              value={resetData.token}
              onChange={(e) => {
                setResetData(prev => ({ ...prev, token: e.target.value }))
                if (errors.token) setErrors(prev => ({ ...prev, token: '' }))
              }}
              error={errors.token}
              placeholder="Token from email"
              required
            />

            <Input
              label="New Password"
              type="password"
              value={resetData.newPassword}
              onChange={(e) => {
                setResetData(prev => ({ ...prev, newPassword: e.target.value }))
                if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }))
              }}
              error={errors.newPassword}
              placeholder="••••••"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={resetData.confirmPassword}
              onChange={(e) => {
                setResetData(prev => ({ ...prev, confirmPassword: e.target.value }))
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
              }}
              error={errors.confirmPassword}
              placeholder="••••••"
              required
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full"
            >
              Reset Password
            </Button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-4">
          Remember your password?{' '}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  )
}

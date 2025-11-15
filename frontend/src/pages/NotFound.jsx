import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import { AlertTriangle } from 'lucide-react'
import { handleAxiosError } from '../utils/helpers'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="text-center py-20 space-y-6">
          <div className="flex justify-center">
            <AlertTriangle size={80} className="text-warning" />
          </div>
          
          <div>
            <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
            <p className="text-3xl font-semibold text-gray-700 mb-4">Page Not Found</p>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              ← Back to Dashboard
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/projects')}
            >
              📊 View Projects
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}


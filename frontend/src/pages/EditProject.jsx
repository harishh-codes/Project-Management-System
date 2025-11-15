import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { handleAxiosError, handleAxiosSuccess } from '../utils/helpers'
import { projectAPI } from '../api'
import { ArrowLeft } from 'lucide-react'

export default function EditProject() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true)
      try {
        const res = await projectAPI.getProjectById(id)
        const project = res.data.data

        // Check if user is owner
        const owner = project.owner?._id === currentUser?._id || project.owner === currentUser?._id
        setIsOwner(owner)

        if (!owner) {
          handleAxiosError({ response: { data: { message: 'You do not have permission to edit this project' } } })
          navigate(`/projects/${id}`)
          return
        }

        setFormData({
          name: project.name || '',
          description: project.description || ''
        })
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/not-found')
        } else {
          handleAxiosError(err)
          navigate(`/projects/${id}`)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id, currentUser, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      handleAxiosError({ response: { data: { message: 'Project name is required' } } })
      return
    }

    setSubmitting(true)
    try {
      await projectAPI.updateProject(id, formData)
      handleAxiosSuccess('Project updated successfully')
      navigate(`/projects/${id}`)
    } catch (err) {
      handleAxiosError(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16">
            <p className="text-gray-600 text-lg">Loading project...</p>
          </Card>
        </main>
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16">
            <p className="text-gray-600 text-lg">You do not have permission to edit this project</p>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/projects/${id}`)}
          className="flex items-center gap-2 text-primary hover:text-indigo-700 font-semibold mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Project
        </button>

        <Card>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Project</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition resize-none"
              ></textarea>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Updating...' : 'Update Project'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/projects/${id}`)}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}

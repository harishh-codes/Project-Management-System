import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { handleAxiosError, handleAxiosSuccess } from '../utils/helpers'
import { taskAPI, projectAPI } from '../api'
import { ArrowLeft } from 'lucide-react'

export default function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  })
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [canEdit, setCanEdit] = useState(false)

  useEffect(() => {
    const fetchTaskAndProjects = async () => {
      setLoading(true)
      try {
        const [taskRes, projectsRes] = await Promise.all([
          taskAPI.getTaskById(id),
          projectAPI.getAllProjects({ limit: 1000 })
        ])

        const task = taskRes.data.data

        // Check if user can edit (creator or project owner)
        const canUserEdit = task.createdBy?._id === currentUser?._id

        if (!canUserEdit) {
          // Check if user is project owner
          if (task.project) {
            const projectId = typeof task.project === 'string' ? task.project : task.project._id
            const projectRes = await projectAPI.getProjectById(projectId)
            const isProjectOwner = projectRes.data.data.owner?._id === currentUser?._id || 
                                   projectRes.data.data.owner === currentUser?._id
            setCanEdit(isProjectOwner)
          } else {
            setCanEdit(false)
          }
        } else {
          setCanEdit(true)
        }

        setFormData({
          title: task.title || '',
          description: task.description || '',
          project: task.project ? (typeof task.project === 'string' ? task.project : task.project._id) : '',
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
        })

        setProjects(projectsRes.data.data.projects || [])
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/not-found')
        } else {
          handleAxiosError(err)
          navigate('/tasks')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTaskAndProjects()
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

    if (!formData.title.trim()) {
      handleAxiosError({ response: { data: { message: 'Task title is required' } } })
      return
    }

    setSubmitting(true)
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
      }

      if (formData.project) {
        updateData.project = formData.project
      }

      if (formData.dueDate) {
        updateData.dueDate = new Date(formData.dueDate)
      }

      await taskAPI.updateTask(id, updateData)
      handleAxiosSuccess('Task updated successfully')
      navigate(`/tasks/${id}`)
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
            <p className="text-gray-600 text-lg">Loading task...</p>
          </Card>
        </main>
      </div>
    )
  }

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16">
            <p className="text-gray-600 text-lg">You do not have permission to edit this task</p>
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
          onClick={() => navigate(`/tasks/${id}`)}
          className="flex items-center gap-2 text-primary hover:text-indigo-700 font-semibold mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Task
        </button>

        <Card>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Task</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
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
                placeholder="Enter task description"
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition resize-none"
              ></textarea>
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-secondary to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Updating...' : 'Update Task'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/tasks/${id}`)}
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

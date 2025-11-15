import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { handleAxiosError, handleAxiosSuccess } from '../utils/helpers'
import { taskAPI, projectAPI, userAPI } from '../api'
import { ArrowLeft, Edit2, Trash2, User, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useSelector(state => state.auth)

  const [task, setTask] = useState(null)
  const [project, setProject] = useState(null)
  const [projectMembers, setProjectMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState('')
  const [isProjectOwner, setIsProjectOwner] = useState(false)

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true)
      try {
        const taskRes = await taskAPI.getTaskById(id)
        const taskData = taskRes.data.data

        setTask(taskData)

        // Fetch project details if task has a project
        if (taskData.project) {
          const projectId = typeof taskData.project === 'string' ? taskData.project : taskData.project._id
          const [projectRes, membersRes] = await Promise.all([
            projectAPI.getProjectById(projectId),
            projectAPI.getProjectMembers(projectId, { limit: 1000 })
          ])

          const projectData = projectRes.data.data
          setProject(projectData)
          setProjectMembers(membersRes.data.data.members || [])

          // Check if current user is project owner
          setIsProjectOwner(projectData.owner?._id === currentUser?._id || projectData.owner === currentUser?._id)
        }
      } catch (err) {
        if (err.response?.status === 404) {
          navigate('/not-found')
        } else {
          handleAxiosError(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTaskDetails()
  }, [id, currentUser, navigate])

  const handleAssignTask = async () => {
    if (!selectedMember) {
      handleAxiosError({ response: { data: { message: 'Please select a member' } } })
      return
    }

    try {
      await taskAPI.updateTask(id, { assignedTo: selectedMember })
      handleAxiosSuccess('Task assigned successfully')
      setShowAssignModal(false)
      setSelectedMember('')

      // Refresh task data
      const taskRes = await taskAPI.getTaskById(id)
      setTask(taskRes.data.data)
    } catch (err) {
      handleAxiosError(err)
    }
  }

  const handleUnassignTask = async () => {
    try {
      await taskAPI.updateTask(id, { assignedTo: null })
      handleAxiosSuccess('Task unassigned successfully')

      // Refresh task data
      const taskRes = await taskAPI.getTaskById(id)
      setTask(taskRes.data.data)
    } catch (err) {
      handleAxiosError(err)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await taskAPI.updateTask(id, { status: newStatus })
      handleAxiosSuccess('Task status updated')

      // Refresh task data
      const taskRes = await taskAPI.getTaskById(id)
      setTask(taskRes.data.data)
    } catch (err) {
      handleAxiosError(err)
    }
  }

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await taskAPI.deleteTask(id)
      handleAxiosSuccess('Task deleted successfully')
      navigate(project ? `/projects/${project._id}` : '/tasks')
    } catch (err) {
      handleAxiosError(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16">
            <p className="text-gray-600 text-lg">Loading task details...</p>
          </Card>
        </main>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16">
            <p className="text-gray-600 text-lg">Task not found</p>
          </Card>
        </main>
      </div>
    )
  }

  const statusConfig = {
    todo: { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100' },
    in_progress: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    done: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' }
  }

  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-800' },
    medium: { color: 'bg-yellow-100 text-yellow-800' },
    low: { color: 'bg-green-100 text-green-800' }
  }

  const statusInfo = statusConfig[task.status] || statusConfig.todo
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(project ? `/projects/${project._id}` : '/tasks')}
          className="flex items-center gap-2 text-primary hover:text-indigo-700 font-semibold mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-lg ${statusInfo.bg} flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon size={32} className={statusInfo.color} />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{task.title}</h1>
                    <p className="text-gray-600">{project?.name || 'No project'}</p>
                  </div>
                </div>

                {(isProjectOwner || task.createdBy?._id === currentUser?._id) && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/tasks/${id}/edit`)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteTask}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                  {task.status.replace(/_/g, ' ').toUpperCase()}
                </span>
                {task.priority && (
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${priorityConfig[task.priority]?.color}`}>
                    {task.priority.toUpperCase()} PRIORITY
                  </span>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {task.description || 'No description provided'}
              </p>
            </Card>

            {/* Status Update */}
            {task.status !== 'done' && (
              <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Update Status</h2>
                <div className="flex gap-2">
                  {['todo', 'in_progress', 'done'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={status === task.status}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        status === task.status
                          ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-indigo-700'
                      }`}
                    >
                      {status.replace(/_/g, ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created By</p>
                  <p className="font-semibold text-gray-800">{task.createdBy?.fullName || 'Unknown'}</p>
                </div>
                {task.dueDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <Calendar size={14} />
                      Due Date
                    </p>
                    <p className="font-semibold text-gray-800">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Assigned To */}
            <Card className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} />
                Assigned To
              </h2>

              {task.assignedTo ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="font-semibold text-gray-800">{task.assignedTo.fullName}</p>
                    <p className="text-sm text-gray-600">{task.assignedTo.email}</p>
                  </div>

                  {isProjectOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAssignModal(true)}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-sm"
                      >
                        Change
                      </button>
                      <button
                        onClick={handleUnassignTask}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold text-sm"
                      >
                        Unassign
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 text-sm mb-4 text-center">Not assigned to anyone</p>
                  {isProjectOwner && (
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                    >
                      Assign Member
                    </button>
                  )}
                </div>
              )}
            </Card>

            {/* Project Info */}
            {project && (
              <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Project</h2>
                <div
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 cursor-pointer transition"
                >
                  <p className="font-semibold text-gray-800 hover:text-primary transition">
                    {project.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Assign Modal */}
      {showAssignModal && (
        <Modal title="Assign Task" onClose={() => setShowAssignModal(false)}>
          <div className="space-y-4">
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
            >
              <option value="">Select a member to assign</option>
              {projectMembers.map(member => (
                <option key={member._id} value={member._id}>
                  {member.fullName} ({member.email})
                </option>
              ))}
            </select>

            {projectMembers.length === 0 && (
              <p className="text-sm text-gray-600 text-center">No project members available</p>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAssignTask}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Assign
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

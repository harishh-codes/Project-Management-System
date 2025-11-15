import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { handleAxiosError, handleAxiosSuccess } from '../utils/helpers'
import { projectAPI, taskAPI, userAPI } from '../api'
import { ArrowLeft, Edit2, Users, CheckSquare, Plus, Trash2, Mail, Shield, X } from 'lucide-react'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useSelector(state => state.auth)

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddMember, setShowAddMember] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true)
      try {
        const [projectRes, tasksRes, membersRes, usersRes] = await Promise.all([
          projectAPI.getProjectById(id),
          taskAPI.getTasksByProject(id, { limit: 1000 }),
          projectAPI.getProjectMembers(id, { limit: 1000 }),
          userAPI.getAllUsers({ limit: 1000 })
        ])

        const projectData = projectRes.data.data
        setProject(projectData)
        setTasks(tasksRes.data.data.tasks || [])
        setMembers(membersRes.data.data.members || [])
        setAllUsers(usersRes.data.data.users || [])
        
        // Check if current user is owner
        setIsOwner(projectData.owner?._id === currentUser?._id || projectData.owner === currentUser?._id)
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

    fetchProjectDetails()
  }, [id, currentUser, navigate])

  const handleAddMember = async () => {
    if (!selectedUser) {
      handleAxiosError({ response: { data: { message: 'Please select a user' } } })
      return
    }

    try {
      await projectAPI.addProjectMember(id, { userId: selectedUser })
      handleAxiosSuccess('Member added successfully')
      setShowAddMember(false)
      setSelectedUser('')
      
      // Refresh members list
      const membersRes = await projectAPI.getProjectMembers(id, { limit: 1000 })
      setMembers(membersRes.data.data.members || [])
    } catch (err) {
      handleAxiosError(err)
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!isOwner) {
      handleAxiosError({ response: { data: { message: 'Only project owner can remove members' } } })
      return
    }

    try {
      await projectAPI.removeProjectMember(id, userId)
      handleAxiosSuccess('Member removed successfully')
      
      // Refresh members list
      const membersRes = await projectAPI.getProjectMembers(id, { limit: 1000 })
      setMembers(membersRes.data.data.members || [])
    } catch (err) {
      handleAxiosError(err)
    }
  }

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      return
    }

    try {
      await projectAPI.deleteProject(id)
      handleAxiosSuccess('Project deleted successfully')
      navigate('/projects')
    } catch (err) {
      handleAxiosError(err)
    }
  }

  const availableUsers = allUsers.filter(
    u => !members.some(m => m._id === u._id) && u._id !== currentUser?._id
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16">
            <p className="text-gray-600 text-lg">Loading project details...</p>
          </Card>
        </main>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-16">
            <p className="text-gray-600 text-lg">Project not found</p>
          </Card>
        </main>
      </div>
    )
  }

  const completedTasks = tasks.filter(t => t.status === 'done').length
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-primary hover:text-indigo-700 font-semibold mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{project.name}</h1>
              <p className="text-gray-600">Created by {project.owner?.fullName || 'Unknown'}</p>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Project Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.description || 'No description provided'}
              </p>
            </Card>

            {/* Progress */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Progress</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">
                    {completedTasks} of {tasks.length} tasks completed
                  </span>
                  <span className="text-lg font-bold text-primary">{taskProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${taskProgress}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            {/* Tasks */}
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tasks ({tasks.length})</h2>
                <button
                  onClick={() => navigate('/tasks/create', { state: { projectId: id } })}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary to-teal-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No tasks in this project yet</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div
                      key={task._id}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 cursor-pointer transition group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 group-hover:text-primary transition">
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-1">{task.description}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.status === 'done' ? 'bg-green-100 text-green-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          {task.priority && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar - Members */}
          <div>
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Users size={20} />
                  Members ({members.length})
                </h2>
                {isOwner && (
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition"
                  >
                    <Plus size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {members.length === 0 ? (
                  <p className="text-gray-600 text-sm text-center py-4">No members yet</p>
                ) : (
                  members.map(member => (
                    <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{member.fullName}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                        {member._id === project.owner?._id && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-primary font-semibold">
                            <Shield size={12} />
                            Owner
                          </div>
                        )}
                      </div>
                      {isOwner && member._id !== project.owner?._id && (
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{tasks.length}</p>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">{members.length}</p>
                  <p className="text-sm text-gray-600">Members</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Add Member Modal */}
      {showAddMember && (
        <Modal title="Add Member" onClose={() => setShowAddMember(false)}>
          <div className="space-y-4">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition"
            >
              <option value="">Select a user to add</option>
              {availableUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>

            {availableUsers.length === 0 && (
              <p className="text-sm text-gray-600 text-center">All users are already members</p>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddMember}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Add Member
              </button>
              <button
                onClick={() => setShowAddMember(false)}
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

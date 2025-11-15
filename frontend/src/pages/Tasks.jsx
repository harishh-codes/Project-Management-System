import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Pagination from '../components/Pagination'
import { handleAxiosError } from '../utils/helpers'
import { taskAPI } from '../api'
import { Plus, Search, CheckSquare, AlertCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react'

export default function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const statuses = ['all', 'todo', 'in_progress', 'done']

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const params = { page: currentPage, limit: 10 }
        if (searchTerm) params.search = searchTerm
        if (statusFilter && statusFilter !== 'all') params.status = statusFilter
        const res = await taskAPI.getAllTasks(params)
        setTasks(res.data.data.tasks || [])
        setTotalPages(res.data.data.pagination?.totalPages || 1)
      } catch (err) {
        handleAxiosError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [currentPage, searchTerm, statusFilter])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Tasks</h1>
            <p className="text-gray-600 mt-1">Track and manage your work items</p>
          </div>
          <button
            onClick={() => navigate('/tasks/create')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 whitespace-nowrap"
          >
            <Plus size={20} />
            Create Task
          </button>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-gray-50 outline-none text-gray-700 placeholder-gray-500"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {loading ? (
          <Card className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="animate-spin">
                <CheckSquare size={40} className="text-primary" />
              </div>
            </div>
            <p className="text-gray-600 text-lg">Loading tasks...</p>
          </Card>
        ) : tasks.length === 0 ? (
          <Card className="text-center py-16">
            <div className="flex justify-center mb-4">
              <CheckSquare size={48} className="text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg mb-2">No tasks yet</p>
            <p className="text-gray-500 mb-6">Create your first task to get started</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/tasks/create')}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              Create your first task
            </Button>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onView={() => navigate(`/tasks/${task._id}`)}
                  onEdit={() => navigate(`/tasks/${task._id}/edit`)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function TaskCard({ task, onView, onEdit }) {
  const statusConfig = {
    todo: { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-100' },
    in_progress: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    done: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' }
  }

  const priorityConfig = {
    high: { color: 'bg-red-100 text-red-800', label: 'High' },
    medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
    low: { color: 'bg-green-100 text-green-800', label: 'Low' }
  }

  const statusInfo = statusConfig[task.status] || statusConfig.todo
  const StatusIcon = statusInfo.icon
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border-l-4 border-l-primary">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Task Info */}
        <div className="flex-1 flex gap-4 min-w-0" onClick={onView}>
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${statusInfo.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <StatusIcon size={24} className={statusInfo.color} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition line-clamp-2">
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-1 mt-1">
              {task.description || 'No description'}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                {task.status.replace(/_/g, ' ').toUpperCase()}
              </span>
              
              {task.priority && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[task.priority]?.color || 'bg-gray-100 text-gray-800'}`}>
                  {priorityConfig[task.priority]?.label || task.priority}
                </span>
              )}

              {task.dueDate && (
                <span className="text-xs text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 md:flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 whitespace-nowrap"
          >
            <ArrowRight size={16} />
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 whitespace-nowrap"
          >
            Edit
          </button>
        </div>
      </div>
    </Card>
  )
}
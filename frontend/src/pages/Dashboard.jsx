import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import { handleAxiosError } from '../utils/helpers'
import { projectAPI, taskAPI } from '../api'
import { Plus, FolderPlus, CheckSquare, FolderOpen } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectRes, taskRes] = await Promise.all([
          projectAPI.getAllProjects({ limit: 1000 }),
          taskAPI.getAllTasks({ limit: 1000 })
        ])
        const projects = projectRes.data.data.projects || []
        const tasks = taskRes.data.data.tasks || []
        const completed = tasks.filter(t => t.status === 'done').length
        
        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          completedTasks: completed
        })
      } catch (err) {
        handleAxiosError(err)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, {user?.fullName || user?.username}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stats.totalProjects}</div>
              <p className="text-gray-600">Total Projects</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">{stats.totalTasks}</div>
              <p className="text-gray-600">Total Tasks</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-warning mb-2">{stats.completedTasks}</div>
              <p className="text-gray-600">Completed Tasks</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionButton
              variant="primary"
              icon={FolderPlus}
              label="Create Project"
              onClick={() => navigate('/projects/create')}
            />
            <ActionButton
              variant="secondary"
              icon={Plus}
              label="Create Task"
              onClick={() => navigate('/tasks/create')}
            />
            <ActionButton
              variant="outline"
              icon={FolderOpen}
              label="View Projects"
              onClick={() => navigate('/projects')}
            />
            <ActionButton
              variant="outline"
              icon={CheckSquare}
              label="View Tasks"
              onClick={() => navigate('/tasks')}
            />
          </div>
        </Card>

        {/* Profile is available via the header profile menu */}
        <div className="mt-8">
          <Card>
            <h2 className="text-xl text-gray-600">Tip</h2>
            <p className="text-gray-700">Access your profile and account actions from the profile icon in the top-right corner.</p>
          </Card>
        </div>
      </main>
    </div>
  )
}

function ActionButton({ variant, icon: Icon, label, onClick }) {
  const baseStyles = 'w-full h-20 flex items-center justify-center gap-3 rounded-lg transition-all duration-200 font-semibold'
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary to-indigo-600 text-white hover:shadow-lg hover:from-primary hover:to-indigo-700 hover:scale-105',
    secondary: 'bg-gradient-to-r from-secondary to-teal-600 text-white hover:shadow-lg hover:from-secondary hover:to-teal-700 hover:scale-105',
    outline: 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-105'
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      <Icon size={22} className="flex-shrink-0" />
      <span>{label}</span>
    </button>
  )
}

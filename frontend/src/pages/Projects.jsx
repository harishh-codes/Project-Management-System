import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Pagination from '../components/Pagination'
import { handleAxiosError } from '../utils/helpers'
import { projectAPI } from '../api'
import { FolderPlus, Search, Folder, ArrowRight, Edit2 } from 'lucide-react'

export default function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Fetch projects from API
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const response = await projectAPI.getAllProjects({
          page: currentPage,
          search: searchTerm,
        })
        console.log(response.data.data.projects);
        setProjects(response.data.data.projects || [])
        setTotalPages(response.data.data.pagination?.totalPages || 1)
      } catch (error) {
        handleAxiosError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [currentPage, searchTerm])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Projects</h1>
            <p className="text-gray-600 mt-1">Manage and organize your projects</p>
          </div>
          <button
            onClick={() => navigate('/projects/create')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 whitespace-nowrap"
          >
            <FolderPlus size={20} />
            Create Project
          </button>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-gray-50 outline-none text-gray-700 placeholder-gray-500"
            />
          </div>
        </Card>

        {loading ? (
          <Card className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="animate-spin">
                <Folder size={40} className="text-primary" />
              </div>
            </div>
            <p className="text-gray-600 text-lg">Loading projects...</p>
          </Card>
        ) : projects.length === 0 ? (
          <Card className="text-center py-16">
            <div className="flex justify-center mb-4">
              <Folder size={48} className="text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg mb-2">No projects yet</p>
            <p className="text-gray-500 mb-6">Create your first project to get started</p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/projects/create')}
              className="flex items-center gap-2 mx-auto"
            >
              <FolderPlus size={18} />
              Create your first project
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  onView={() => navigate(`/projects/${project._id}`)}
                  onEdit={() => navigate(`/projects/${project._id}/edit`)}
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

function ProjectCard({ project, onView, onEdit }) {
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
      <div onClick={onView} className="space-y-4 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition line-clamp-2">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Project</p>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
            <Folder size={20} className="text-primary" />
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
          {project.description || 'No description provided'}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{project.tasks?.length || 0}</p>
            <p className="text-xs text-gray-500">Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary">{project.members?.length || 1}</p>
            <p className="text-xs text-gray-500">Members</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => { 
              e.stopPropagation()
              onView() 
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <ArrowRight size={16} />
            View
          </button>
          <button
            onClick={(e) => { 
              e.stopPropagation()
              onEdit() 
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
          >
            <Edit2 size={16} />
            Edit
          </button>
        </div>
      </div>
    </Card>
  )
}

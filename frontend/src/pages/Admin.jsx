import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import { handleAxiosError } from '../utils/helpers'
import { userAPI, activityAPI } from '../api'
import { Users, Activity, Search, Shield, Mail, CheckCircle2, AlertCircle, X, Clock, FileText } from 'lucide-react'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDetailsLoading, setUserDetailsLoading] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [activityDetailsLoading, setActivityDetailsLoading] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)

  // Fetch users
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab, currentPage, searchTerm])

  // Fetch activities
  useEffect(() => {
    if (activeTab === 'activities') {
      fetchActivities()
    }
  }, [activeTab, currentPage, searchTerm])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await userAPI.getAllUsers({
        page: currentPage,
        limit: 10,
        search: searchTerm
      })
      const { users: userData = [], pagination = {} } = res.data.data
      setUsers(userData)
      setTotalPages(pagination.totalPages || 1)
    } catch (err) {
      handleAxiosError(err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchActivities = async () => {
    setLoading(true)
    try {
      console.log('📊 Fetching activities with params:', { page: currentPage, limit: 10 })
      const res = await activityAPI.getActivities({
        page: currentPage,
        limit: 10
      })
      console.log('📊 Activities response:', res.data)
      
      // Handle different response structures
      const { logs = [], activities: actData = [], pagination = {} } = res.data.data
      const activities = logs.length > 0 ? logs : actData
      
      console.log('📊 Processed activities:', activities)
      console.log('📊 Total pages:', pagination.totalPages)
      
      setActivities(activities)
      setTotalPages(pagination.totalPages || 1)
    } catch (err) {
      console.error('❌ Activity fetch error:', err.response?.data || err.message)
      handleAxiosError(err)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewUserDetails = async (userId) => {
    setUserDetailsLoading(true)
    setShowUserModal(true)
    try {
      const res = await userAPI.getUserById(userId)
      setSelectedUser(res.data.data)
      console.log('👤 User details fetched:', res.data.data)
    } catch (err) {
      console.error('❌ Error fetching user details:', err.message)
      handleAxiosError(err)
      setShowUserModal(false)
    } finally {
      setUserDetailsLoading(false)
    }
  }

  const handleViewActivityDetails = async (activityId) => {
    setActivityDetailsLoading(true)
    setShowActivityModal(true)
    try {
      const res = await activityAPI.getActivityById(activityId)
      setSelectedActivity(res.data.data)
      console.log('📋 Activity details fetched:', res.data.data)
    } catch (err) {
      console.error('❌ Error fetching activity details:', err.message)
      handleAxiosError(err)
      setShowActivityModal(false)
    } finally {
      setActivityDetailsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 text-sm mt-1">Manage users and monitor system activities</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('users')
                setCurrentPage(1)
              }}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users size={18} />
              Users Management
            </button>
            <button
              onClick={() => {
                setActiveTab('activities')
                setCurrentPage(1)
              }}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition ${
                activeTab === 'activities'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Activity size={18} />
              Activity Logs
            </button>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                  <Search size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="border-2 border-white bg-white shadow-sm focus:border-blue-400 focus:shadow-md"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setCurrentPage(1)
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      title="Clear search"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 ml-16">Type to search in real-time • Clear results with the X button</p>
            </div>

            {loading ? (
              <Card className="text-center py-12 border border-gray-200">
                <div className="animate-pulse">
                  <p className="text-gray-600">Loading users...</p>
                </div>
              </Card>
            ) : users.length === 0 ? (
              <Card className="text-center py-12 border border-gray-200">
                <Users size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No users found</p>
              </Card>
            ) : (
              <>
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Username</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Verified</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                          <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                              <Mail size={16} className="text-gray-400" />
                              {user.email}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {user.role === 'admin' ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                                  <Shield size={14} /> Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                  User
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-center">
                              {user.isEmailVerified ? (
                                <span className="inline-flex items-center gap-1 text-secondary">
                                  <CheckCircle2 size={16} /> Yes
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-warning">
                                  <AlertCircle size={16} /> No
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-center">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewUserDetails(user._id)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <>
            <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                  <Search size={20} className="text-emerald-600" />
                </div>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search activities by action or resource..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="border-2 border-white bg-white shadow-sm focus:border-emerald-400 focus:shadow-md"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setCurrentPage(1)
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      title="Clear search"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 ml-16">Type to search in real-time • Clear results with the X button</p>
            </div>

            {loading ? (
              <Card className="text-center py-12 border border-gray-200">
                <div className="animate-pulse">
                  <p className="text-gray-600">Loading activities...</p>
                </div>
              </Card>
            ) : activities.length === 0 ? (
              <Card className="text-center py-12 border border-gray-200">
                <Activity size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No activities found</p>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {activities.map((activity, index) => {
                    // Determine action color based on action type
                    const getActionColor = (action) => {
                      switch(action) {
                        case 'CREATE': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'text-emerald-500' }
                        case 'UPDATE': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' }
                        case 'DELETE': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' }
                        default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-500' }
                      }
                    }

                    const getResourceColor = (type) => {
                      switch(type) {
                        case 'PROJECT': return 'bg-purple-100 text-purple-800'
                        case 'TASK': return 'bg-blue-100 text-blue-800'
                        case 'USER': return 'bg-indigo-100 text-indigo-800'
                        default: return 'bg-gray-100 text-gray-800'
                      }
                    }

                    const colors = getActionColor(activity.action)
                    
                    return (
                      <div key={activity._id} className={`${colors.bg} ${colors.border} border-2 rounded-lg p-5 hover:shadow-lg transition-all duration-200 hover:border-opacity-100 group`}>
                        <div className="flex justify-between items-start gap-4">
                          {/* Left Content */}
                          <div className="flex-1">
                            {/* Header with action and resource type */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-2 rounded-lg ${colors.bg} border ${colors.border}`}>
                                <Activity size={18} className={colors.icon} />
                              </div>
                              <div className="flex items-center gap-2">
                                <h3 className={`font-bold text-sm uppercase tracking-wider ${colors.text}`}>
                                  {activity.action}
                                </h3>
                                <span className={`${getResourceColor(activity.resourceType)} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                                  {activity.resourceType}
                                </span>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm font-medium text-gray-800 mb-4 leading-relaxed">
                              {activity.description}
                            </p>

                            {/* Detailed Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 pt-3 border-t border-gray-300 border-opacity-40">
                              {/* User Info */}
                              <div className="bg-white bg-opacity-50 rounded-lg p-3 hover:bg-opacity-75 transition">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">User</p>
                                <p className="text-sm font-bold text-gray-900 truncate">
                                  {activity.userId?.username || 'Unknown'}
                                </p>
                                {activity.userId?.email && (
                                  <p className="text-xs text-gray-600 truncate mt-0.5">{activity.userId.email}</p>
                                )}
                              </div>

                              {/* Resource Type */}
                              <div className="bg-white bg-opacity-50 rounded-lg p-3 hover:bg-opacity-75 transition">
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Type</p>
                                <span className={`inline-block ${getResourceColor(activity.resourceType)} text-xs font-bold px-2 py-1 rounded-md`}>
                                  {activity.resourceType}
                                </span>
                              </div>
                            </div>

                            {/* Status Indicator */}
                            <div className="flex items-center gap-2 text-xs mt-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span className="text-gray-600 font-medium">Activity Logged</span>
                            </div>
                          </div>

                          {/* Right Timestamp Section */}
                          <div className="text-right whitespace-nowrap bg-white bg-opacity-60 rounded-lg p-4 border border-gray-300 border-opacity-40 group-hover:bg-opacity-100 transition min-w-max">
                            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Timestamp</p>
                            <p className="text-sm font-bold text-gray-900">
                              {new Date(activity.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-sm font-bold text-gray-900 mt-1">
                              {new Date(activity.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                              })}
                            </p>
                            <div className="mt-3 pt-3 border-t border-gray-300">
                              <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Hover Action Bar */}
                        <div className="mt-4 pt-4 border-t border-gray-300 border-opacity-30 flex justify-end">
                          <button className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-60 transition group/btn">
                            <FileText size={14} />
                            View Full Details
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* User Details Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl border border-gray-200 shadow-xl">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {userDetailsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">
                    <p className="text-gray-600">Loading user details...</p>
                  </div>
                </div>
              ) : selectedUser ? (
                <div className="space-y-6">
                  {/* User Header */}
                  <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Users size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedUser.fullName || selectedUser.username}</h3>
                      <p className="text-gray-600 text-sm">{selectedUser.email}</p>
                    </div>
                  </div>

                  {/* User Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase">Username</label>
                        <p className="text-sm text-gray-900 font-medium">{selectedUser.username}</p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase">Email</label>
                        <p className="text-sm text-gray-900 flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />
                          {selectedUser.email}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase">Full Name</label>
                        <p className="text-sm text-gray-900">{selectedUser.fullName || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">Account Status</h4>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase">Role</label>
                        <div className="mt-1">
                          {selectedUser.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                              <Shield size={14} /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                              User
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase">Email Verified</label>
                        <div className="mt-1">
                          {selectedUser.isEmailVerified ? (
                            <span className="inline-flex items-center gap-1 text-secondary text-sm">
                              <CheckCircle2 size={16} /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-warning text-sm">
                              <AlertCircle size={16} /> No
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-medium">Created</p>
                        <p className="text-sm text-gray-900">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-medium">Last Updated</p>
                        <p className="text-sm text-gray-900">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* User ID */}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="text-xs font-medium text-gray-600 uppercase">User ID</label>
                    <p className="text-xs text-gray-600 font-mono mt-1 break-all">{selectedUser._id}</p>
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                    <Button 
                      variant="outline"
                      onClick={() => setShowUserModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Failed to load user details</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

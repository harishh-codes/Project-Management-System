import client from './client'

export const authAPI = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  logout: () => client.post('/auth/logout'),
  getCurrentUser: () => client.post('/auth/current-user'),
  refreshToken: (refreshToken) => client.post('/auth/refresh-token', { refreshToken }),
  verifyEmail: (token) => client.get(`/auth/verify-email/${token}`),
  resendEmailVerification: () => client.post('/auth/resend-email-verification'),
  forgotPassword: (data) => client.post('/auth/forgot-password', data),
  resetPassword: (token, data) => client.post(`/auth/reset-password/${token}`, data),
  changePassword: (data) => client.post('/auth/change-password', data),
}

export const projectAPI = {
  getAllProjects: (params) => client.get('/projects', { params }),
  createProject: (data) => client.post('/projects', data),
  getProjectById: (id) => client.get(`/projects/${id}`),
  updateProject: (id, data) => client.put(`/projects/${id}`, data),
  deleteProject: (id) => client.delete(`/projects/${id}`),
  getProjectMembers: (id, params) => client.get(`/projects/${id}/members`, { params }),
  addProjectMember: (id, data) => client.post(`/projects/${id}/members`, data),
  removeProjectMember: (id, userId) => client.delete(`/projects/${id}/members/${userId}`),
}

export const taskAPI = {
  getAllTasks: (params) => client.get('/tasks', { params }),
  createTask: (data) => client.post('/tasks', data),
  getTaskById: (id) => client.get(`/tasks/${id}`),
  updateTask: (id, data) => client.put(`/tasks/${id}`, data),
  deleteTask: (id) => client.delete(`/tasks/${id}`),
  getTasksByProject: (projectId, params) => client.get(`/projects/${projectId}/tasks`, { params }),
}

export const userAPI = {
  getAllUsers: (params) => client.get('/users', { params }),
  getUserById: (id) => client.get(`/users/${id}`),
  updateProfile: (data) => client.put('/users/profile', data),
  updateAvatar: (formData) => client.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export const activityAPI = {
  getActivities: (params) => client.get('/activity-logs', { params }),
  getActivityByResource: (resourceType, resourceId, params) => 
    client.get(`/activity-logs/${resourceType}/${resourceId}`, { params }),
  getActivityById: (activityId) => client.get(`/activity-logs/details/${activityId}`),
}

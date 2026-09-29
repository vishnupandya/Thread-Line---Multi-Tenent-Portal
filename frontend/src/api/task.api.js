import api from './client.js';

export const taskApi = {
  listByProject: (projectId, params = {}) => api.get(`/projects/${projectId}/tasks`, { params }),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  get: (taskId) => api.get(`/tasks/${taskId}`),
  update: (taskId, data) => api.patch(`/tasks/${taskId}`, data),
  delete: (taskId) => api.delete(`/tasks/${taskId}`),
};

export default taskApi;

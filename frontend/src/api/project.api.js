import api from './client.js';

export const projectApi = {
  listByOrg: (orgId) => api.get(`/organizations/${orgId}/projects`),
  create: (orgId, data) => api.post(`/organizations/${orgId}/projects`, data),
  get: (projectId) => api.get(`/projects/${projectId}`),
  update: (projectId, data) => api.patch(`/projects/${projectId}`, data),
  delete: (projectId) => api.delete(`/projects/${projectId}`),
};

export default projectApi;

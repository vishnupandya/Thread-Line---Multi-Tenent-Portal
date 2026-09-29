import api from './client.js';

export const organizationApi = {
  list: () => api.get('/organizations'),
  get: (orgId) => api.get(`/organizations/${orgId}`),
  create: (data) => api.post('/organizations', data),
  getMembers: (orgId) => api.get(`/organizations/${orgId}/members`),
  addMember: (orgId, data) => api.post(`/organizations/${orgId}/members`, data),
  removeMember: (orgId, userId) => api.delete(`/organizations/${orgId}/members/${userId}`),
};

export default organizationApi;

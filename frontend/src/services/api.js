import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const patientApi = {
  getPatients: async (params = {}) => {
    const response = await apiClient.get('/patients', { params });
    return response.data;
  },

  getPatientById: async (id) => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  createPatient: async (patientData) => {
    const response = await apiClient.post('/patients', patientData);
    return response.data;
  },

  updatePatient: async (id, patientData) => {
    const response = await apiClient.put(`/patients/${id}`, patientData);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/patients/${id}/status`, { status });
    return response.data;
  },

  dischargePatient: async (id) => {
    const response = await apiClient.patch(`/patients/${id}/discharge`);
    return response.data;
  },

  deletePatient: async (id) => {
    const response = await apiClient.delete(`/patients/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/stats');
    return response.data;
  },

  getMetadata: async () => {
    const response = await apiClient.get('/metadata');
    return response.data;
  },
};

export default apiClient;

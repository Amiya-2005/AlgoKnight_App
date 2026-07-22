import api from './api';

const AI_ENDPOINTS = {
  ANALYSIS: '/fetch/aiAnalysis'
};

export const getAnalysis = async (refresh = false) => {

  const response = await api.get(`${AI_ENDPOINTS.ANALYSIS}${refresh ? '?refresh=true' : ''}`);
  return response.data;

}

export default {
  getAnalysis
}

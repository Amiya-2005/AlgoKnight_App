import api from './api';

const SHEET_ENDPOINTS = {
  ALL_TASKS : '/fetch/smartsheet?limit=200'
};

export const getFullSheet = async (refresh = false) => {

  const url = `${SHEET_ENDPOINTS.ALL_TASKS}${refresh ? '&refresh=true' : ''}`;
  const response = await api.get(url);
  return response.data;

}

export default {
  getFullSheet
}

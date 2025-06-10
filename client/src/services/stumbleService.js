import api from './api';

const STUMBLE_ENDPOINTS = {
  GET_STUMBLE: '/saved/stumbles/get',
  ADD_STUMBLE: '/saved/stumbles/add',
  REMOVE_STUMBLE: '/saved/stumbles/remove',
};

export const getAllStumbles = async () => {
  const response = await api.get(STUMBLE_ENDPOINTS.GET_STUMBLE);
  return response.data;
}

export const addStumble = async (stumble_data) => {
  const response = await api.post(STUMBLE_ENDPOINTS.ADD_STUMBLE, stumble_data);
  return response.data;
}

export const removeStumble = async (index) => {
  const response = await api.post(STUMBLE_ENDPOINTS.REMOVE_STUMBLE, {index : index});
  return response.data;
}


export default { getAllStumbles, addStumble, removeStumble }

import api from './api';

const CONTEST_ENDPOINTS = {
  GET_UPSOLVE: '/contests/upsolve',
  GET_FAVS: '/contests/favorites/get',
  ADD_FAVS: '/contests/favorites/add',
  REMOVE_FAVS: '/contests/favorites/remove',
};

export const getUpsolve = async () => {
  const response = await api.get(CONTEST_ENDPOINTS.GET_UPSOLVE);
  return response.data;
}

export const getFavorites = async () => {
  const response = await api.get(CONTEST_ENDPOINTS.GET_FAVS);
  return response.data;
}

export const addToFavorite = async (contest_data) => {
  const response = await api.post(CONTEST_ENDPOINTS.ADD_FAVS, contest_data);
  return response.data;
}

export const removeFromFavorite = async (url) => {
  const response = await api.post(CONTEST_ENDPOINTS.REMOVE_FAVS, {url : url});
  return response.data;
}

export default { getUpsolve, getFavorites, addToFavorite, removeFromFavorite }

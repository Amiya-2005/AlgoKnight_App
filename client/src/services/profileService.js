import api from './api';

const USER_ENDPOINTS = {
  GET_PROFILE: '/profile/getProfileData',
  UPDATE_PROFILE: '/profile/updateProfile',
  UPDATE_HANDLES: '/profile/updateHandles'
};

export const getProfileData = async () => {
  const response = await api.get(USER_ENDPOINTS.GET_PROFILE);
  return response.data;
}

export const updateProfile = async (new_data) => {
  const response = await api.post(USER_ENDPOINTS.UPDATE_PROFILE, new_data);
  return response.data;
}

export const updateHandles = async (new_handles) => {
  const response = await api.post(USER_ENDPOINTS.UPDATE_HANDLES, new_handles);
  return response.data;
}

export default { getProfileData, updateProfile, updateHandles }

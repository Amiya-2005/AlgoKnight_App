import api from './api';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/signin',
  REGISTER: '/auth/signup',
  GOOGLE_LOGIN: '/auth/gsign',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  VERIFY_EMAIL: '/auth/verify-email',
  CURRENT_USER: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',
};

export const login = async (credentials) => {
  const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
  return response.data;
};

export const gsign = async (credentials) => {
  const response = await api.post(AUTH_ENDPOINTS.GOOGLE_LOGIN, credentials);
  return response.data;
}

export const logout = async () => {
  const response = await api.post(AUTH_ENDPOINTS.LOGOUT);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
  return response.data;
};


// ✅ Add default export for compatibility
export default {
  login,
  register,
  gsign,
  forgotPassword,
  resetPassword,
  logout,
  verifyEmail,
};

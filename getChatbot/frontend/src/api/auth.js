import api from './api';

/// LOGIN
export const login = async (credentials) => {
  const response = await api.post('/users/login/', credentials);
  const { access, refresh } = response.data;

  if (access) {
    localStorage.setItem('accessToken', access);
  }
  if (refresh) {
    localStorage.setItem('refreshToken', refresh);
  }

  return response.data;
};

// REGISTER
export const register = async (userData) => {
  const response = await api.post('/users/register/', userData);

  const { access, refresh } = response.data;

  if (access) {
    localStorage.setItem('accessToken', access);
  }
  if (refresh) {
    localStorage.setItem('refreshToken', refresh);
  }

  return response.data;
};

// LOGOUT
// api/auth.js or wherever this is
export const logout = (navigate) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  navigate('/login');
};


import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

// Load user profile
const loadUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/auth/me`, config);
  return response.data;
};

// Logout user
const logout = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

const authService = {
  register,
  login,
  loadUser,
  logout,
};

export default authService;
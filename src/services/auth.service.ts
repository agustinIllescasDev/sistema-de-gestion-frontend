//auth.service.ts

import api from './api';

const handleLogin = async (credentials: { mail: string; password: string }) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export default handleLogin;

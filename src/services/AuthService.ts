import axios from 'axios';
import { url } from '../components/Table';

const api = axios.create({
  // baseURL: 'http://192.168.1.13:4000/api',
  baseURL: `${url}/api`
});

export const register = async (username: string, password: string) => {
  const response = await api.post('/register', { username, password });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await api.post('/login', { username, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const getEntries = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get('/entries', {
    headers: { Authorization: token },
  });
  return response.data;
};

export const createEntry = async (entry: any) => {
  const token = localStorage.getItem('token');
  const response = await api.post('/entries', entry, {
    headers: { Authorization: token },
  });
  return response.data;
};

export const deleteEntry = async (id: number) => {
  const token = localStorage.getItem('token');
  await api.delete(`/entries/${id}`, {
    headers: { Authorization: token },
  });
};

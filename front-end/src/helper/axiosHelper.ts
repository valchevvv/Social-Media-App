import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const get = async (url: string, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && axios.isAxiosError(error)) {
      if (!error.response) throw { message: 'Unable to connect to server. Please try again later.' };
      if (error.response.data.error) throw {
        message: error.response.data.error,
        status: error.response.status
      };
    } else {
      throw { message: 'An unexpected error occurred' };
    }
  }
};

const post = async (url: string, data: object) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && axios.isAxiosError(error)) {
      if (!error.response) throw { message: 'Unable to connect to server. Please try again later.' };
      if (error.response.data.error) throw {
        message: error.response.data.error,
        status: error.response.status
      };
    } else {
      throw { message: 'An unexpected error occurred' };
    }
  }
};

const patch = async (url:string, data: object) => {
  try {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && axios.isAxiosError(error)) {
      if (!error.response) throw { message: 'Unable to connect to server. Please try again later.' };
      if (error.response.data.error) throw {
        message: error.response.data.error,
        status: error.response.status
      };
    } else {
      throw { message: 'An unexpected error occurred' };
    }
  }
};

export { get, post, patch };
import axios, { AxiosError, AxiosInstance, CreateAxiosDefaults } from 'axios';
import { urls } from '@/constants/common';
import { signOut } from 'next-auth/react';

const investorAxiosInstance: AxiosInstance = axios.create({
  baseURL: urls.investor,
  withCredentials: true,
} as CreateAxiosDefaults);

investorAxiosInstance.interceptors.request.use(config => {
  config.headers['Accept'] = 'application/json';
  config.headers['Content-Type'] = 'application/json';
  console.log("REQUEST CONFIG:", config)
  return config;
});

investorAxiosInstance.interceptors.response.use(
  function (response) {
    console.log('axios interceptor response:', response)
    return response;
  },
  function (error: AxiosError) {
    if (error.response?.status === 401) {
      signOut();
    }
  },
);

export default investorAxiosInstance;

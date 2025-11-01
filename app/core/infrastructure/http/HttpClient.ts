import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { injectable, inject } from 'inversiland';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IHttpClient } from '@/core/domain/specifications/IHttpClient';
import { Env, EnvToken } from '@/core/domain/entities/Env';

@injectable()
export class HttpClient implements IHttpClient {
  private axiosInstance: AxiosInstance;

  constructor(@inject(EnvToken) private readonly env: Env) {
    this.axiosInstance = axios.create({
      baseURL: env.apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Add auth token if available from AsyncStorage
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<TData, TResponse>(url: string, data: TData, config?: AxiosRequestConfig): Promise<TResponse> {
    const response = await this.axiosInstance.post<TResponse>(url, data, config);
    return response.data;
  }

  async put<TData, TResponse>(url: string, data: TData, config?: AxiosRequestConfig): Promise<TResponse> {
    const response = await this.axiosInstance.put<TResponse>(url, data, config);
    return response.data;
  }

  async patch<TData, TResponse>(url: string, data: TData, config?: AxiosRequestConfig): Promise<TResponse> {
    const response = await this.axiosInstance.patch<TResponse>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

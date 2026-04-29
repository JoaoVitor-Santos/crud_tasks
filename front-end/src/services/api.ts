import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthRequest, LoginResponse, RegisterResponse } from '../types/auth';
import { CreateTaskRequest } from '../types/task';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: baseURL,
      timeout: 10000,
    });

    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Tratamento de erro global
        if (error.response?.status === 401) {
          // Token expirado, logout
          AsyncStorage.removeItem('access_token');
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public async register(data: AuthRequest): Promise<RegisterResponse> {
    const response: AxiosResponse<RegisterResponse> = await this.api.post('/users/register', data);
    return response.data;
  }

  public async login(data: AuthRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/users/login', data);
    return response.data;
  }

  public async logout(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.post('/users/logout');
    return response.data;
  }

  public async createTask(data: CreateTaskRequest): Promise<any> {
    const response: AxiosResponse<any> = await this.api.post('/tasks/create', data);
    return response.data;
  }

  public async list_my_tasks(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/tasks/my-tasks');
    return response.data;
  }

  public async deleteTask(idt_tarefa: number): Promise<any> {
    const response: AxiosResponse<any> = await this.api.delete(`/tasks/${idt_tarefa}`);
    return response.data;
  }

  public async updateTask(idt_tarefa: number, data: any): Promise<any> {
    const response: AxiosResponse<any> = await this.api.put(`/tasks/${idt_tarefa}`, data);
    return response.data;
  }

  public async listStatus(): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get('/status/list');
    return response.data.status;
  }
}


export default ApiService.getInstance();
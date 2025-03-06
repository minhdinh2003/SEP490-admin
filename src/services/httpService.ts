import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IPagingParam } from '@/constants/paging';
import { useAuthStore } from '@/store/use-auth-store';

class HttpService {
  protected http: AxiosInstance;
  Controller: string = '';
  constructor() {
    this.http = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.http.interceptors.request.use(
      (config: any) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        return Promise.resolve(response);
      },
      (error) => {
        // to-do
        return Promise.resolve(error.response);
      }
    );
  }
  getUrl(url: string): string {
    return `${this.Controller}${url}`;
  }
  async get<T>(url: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.http.get<T>(this.getUrl(url), { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAll<T>(params: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.http.get<T>(this.getUrl('/all'), { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getById<T>(id: number): Promise<T> {
    try {
      const response = await this.http.get<T>(`${this.getUrl('')}/${id}`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async getByIdReference<T>(id: number, data: any): Promise<T> {
    try {
      const response = await this.http.post<T>(
        `${this.getUrl('')}/${id}/reference`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(url: string, data: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.http.post<T>(this.getUrl(url), data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(url: string, data: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.http.put<T>(this.getUrl(url), data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateById<T>(id: number, data: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.http.put<T>(`${this.getUrl('')}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.http.delete<T>(this.getUrl(url));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getPaging<T>(param: IPagingParam) {
    try {
      const response = await this.http.post<T>(this.getUrl('/paging'), param);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async deleteById<T>(id: number): Promise<T> {
    try {
      const response = await this.http.delete<T>(`${this.getUrl('')}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default HttpService;

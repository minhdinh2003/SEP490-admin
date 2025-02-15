import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class HttpService {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: process.env.BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.http.interceptors.request.use(
      (config: any) => {
        const token =
          typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
      (response: AxiosResponse) => response,
      (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.http.get<T>(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(url: string, data: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.http.post<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(url: string, data: Record<string, any> = {}): Promise<T> {
    try {
      const response = await this.http.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.http.delete<T>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default HttpService;

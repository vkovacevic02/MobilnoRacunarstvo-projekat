import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../constants/api';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, Putovanje, Aranzman } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // dodaje token u svaki zahtev (iz async storage)
      this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // odjavljuje korisnika ako je token istekao
    // ako je unauthorized, briše token i user podatke iz async storage
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
      }
    );
  }

  // login - salje post zahtev za login, cuva token i user podatke u async storage
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.LOGIN,
      credentials
    );
    
    if (response.data.success) {
      await AsyncStorage.setItem('auth_token', response.data.data.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.data.user));
    }
    
    return response.data.data;
  }

  // register - salje post zahtev za registraciju, ne cuva token i user podatke
  async register(userData: RegisterRequest): Promise<any> {
    const response = await this.api.post<ApiResponse<any>>(
      API_CONFIG.ENDPOINTS.REGISTER,
      userData
    );
    
    return response.data;
  }

  // logout - salje post zahtev za logout, brise token i user podatke iz async storage
  async logout(): Promise<void> {
    try {
      await this.api.post(API_CONFIG.ENDPOINTS.LOGOUT);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
  }

  async getUserInfo(): Promise<ApiResponse<any>> {
    return this.get<ApiResponse<any>>('/user');
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.api.get<ApiResponse<T>>(endpoint);
    return response.data.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.api.post<ApiResponse<T>>(endpoint, data);
    return response.data.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.api.put<ApiResponse<T>>(endpoint, data);
    return response.data.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<ApiResponse<T>>(endpoint);
    return response.data.data;
  }

  async getPutovanja(): Promise<Putovanje[]> {
    return this.get<Putovanje[]>(API_CONFIG.ENDPOINTS.PUTOVANJA);
  }

  async getAranzmaniByDestination(putovanjeId: number): Promise<Aranzman[]> {
    return this.get<Aranzman[]>(`${API_CONFIG.ENDPOINTS.ARANZMANI}/${putovanjeId}`);
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    await this.post('/verify-email', { 
      email, 
      code 
    });
  }

  async resendVerificationCode(email: string): Promise<void> {
    await this.post('/resend-verification', { 
      email 
    });
  }

  async sendPasswordResetEmail(email: string): Promise<{code: string}> {
    return await this.post('/password-reset', { email });
  }

  async verifyResetCode(email: string, code: string): Promise<void> {
    await this.post('/password-reset/verify', { 
      email, 
      code 
    });
  }

  async resetPassword(email: string, password: string, code: string): Promise<void> {
    await this.post('/password-reset/confirm', { 
      email, 
      password, 
      code 
    });
  }

  async getUserBookings(userId: number): Promise<any[]> {
    return this.get<any[]>(`/users/${userId}/putnici`);
  }

  async getUserPayments(userId: number): Promise<any[]> {
    return this.get<any[]>(`/users/${userId}/uplate`);
  }

  async getPassengersByArrangement(aranzmanId: number): Promise<any[]> {
    return this.get<any[]>(`/aranzmani/${aranzmanId}/putnici`);
  }

  async reserveArrangement(aranzmanId: number, count: number): Promise<{ rezervisano: number; preostalo: number }> {
    const response = await this.api.post<ApiResponse<{ rezervisano: number; preostalo: number }>>(
      `/aranzmani/${aranzmanId}/rezervisi`,
      { count }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Rezervacija nije uspela');
    }
    return response.data.data;
  }
}

export default new ApiService();

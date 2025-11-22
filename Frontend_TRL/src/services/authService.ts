import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'ADMIN';
  }
};

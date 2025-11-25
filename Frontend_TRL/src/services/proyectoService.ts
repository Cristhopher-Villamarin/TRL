import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8080/api/proyectos';

export interface ProyectoRequest {
  nombreProyecto: string;
  tipoProyecto: string;
  responsable: string;
  tipologia: string;
  areaInvestigacion: string;
  duracionMeses: number;
  departamento: string;
  carrera: string;
  lineaInvestigacion: string;
}

export interface ProyectoResponse {
  idProyecto: number;
  idUsuario: number;
  nombreUsuario: string;
  nombreProyecto: string;
  tipoProyecto: string;
  responsable: string;
  tipologia: string;
  areaInvestigacion: string;
  duracionMeses: number;
  departamento: string;
  carrera: string;
  lineaInvestigacion: string;
}

const getAuthHeader = () => {
  const user = authService.getCurrentUser();
  if (user?.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

export const proyectoService = {
  async createProyecto(proyecto: ProyectoRequest): Promise<ProyectoResponse> {
    const response = await axios.post(API_URL, proyecto, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async getProyectos(): Promise<ProyectoResponse[]> {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async getProyectoById(id: number): Promise<ProyectoResponse> {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async updateProyecto(id: number, proyecto: ProyectoRequest): Promise<ProyectoResponse> {
    const response = await axios.put(`${API_URL}/${id}`, proyecto, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  async deleteProyecto(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeader()
    });
  }
};

import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8081/api/niveles-trl';

export interface NivelTRLRequest {
    numNivel: number;
    nomNivel: string;
    entorno: string;
    faseDesarrollo: string;
    puntajeMinimo: number;
    descripcionTrl: string;
}

export interface NivelTRLResponse {
    idNivel: number;
    numNivel: number;
    nomNivel: string;
    entorno: string;
    faseDesarrollo: string;
    puntajeMinimo: number;
    descripcionTrl: string;
}

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user?.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

export const nivelTRLService = {
    async getAll(): Promise<NivelTRLResponse[]> {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getById(id: number): Promise<NivelTRLResponse> {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async create(nivel: NivelTRLRequest): Promise<NivelTRLResponse> {
        const response = await axios.post(API_URL, nivel, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async update(id: number, nivel: NivelTRLRequest): Promise<NivelTRLResponse> {
        const response = await axios.put(`${API_URL}/${id}`, nivel, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
    }
};

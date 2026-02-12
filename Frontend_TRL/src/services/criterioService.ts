import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8081/api/criterios';

export interface CriterioRequest {
    idNivel: number;
    nombreCriterio: string;
    puntajeCriterio: number;
    importancia: string;
    justificacion: string;
    estadoEvidencia: string;
}

export interface CriterioResponse {
    idCriterio: number;
    idNivel: number;
    nombreNivel: string;
    nombreCriterio: string;
    puntajeCriterio: number;
    importancia: string;
    justificacion: string;
    estadoEvidencia: string;
    fechaCreacion: string;
    fechaModificacion: string;
}

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user?.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

export const criterioService = {
    async getAll(): Promise<CriterioResponse[]> {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getByNivel(idNivel: number): Promise<CriterioResponse[]> {
        const response = await axios.get(`${API_URL}/nivel/${idNivel}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async getById(id: number): Promise<CriterioResponse> {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async create(criterio: CriterioRequest): Promise<CriterioResponse> {
        const response = await axios.post(API_URL, criterio, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async update(id: number, criterio: CriterioRequest): Promise<CriterioResponse> {
        const response = await axios.put(`${API_URL}/${id}`, criterio, {
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

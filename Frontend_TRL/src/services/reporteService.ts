import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8081/api/reportes';

export interface ReporteProyectoResponse {
    idReporte: number;
    idProyecto: number;
    nombreArchivo: string;
    fechaCreacion: string;
}

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user?.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

export const reporteService = {
    async getReportesByProyecto(idProyecto: number): Promise<ReporteProyectoResponse[]> {
        const response = await axios.get(`${API_URL}/proyecto/${idProyecto}`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    async downloadReporte(idReporte: number, fileName: string): Promise<void> {
        const response = await axios.get(`${API_URL}/${idReporte}/descargar`, {
            headers: getAuthHeader(),
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

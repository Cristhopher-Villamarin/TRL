import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8081/api';

export interface EvidenciaResponse {
    idEvidencia: number;
    idProyecto: number;
    nombreProyecto: string;
    archivoNombre: string;
    descripcion: string;
    fechaCarga: string;
    estadoEvidencia: string;
}

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user?.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

export const evidenciaService = {
    async uploadEvidencia(
        idProyecto: number,
        file: File,
        descripcion: string,
        estadoEvidencia: string
    ): Promise<EvidenciaResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('descripcion', descripcion);
        formData.append('estadoEvidencia', estadoEvidencia);

        const response = await axios.post(
            `${API_URL}/proyectos/${idProyecto}/evidencias`,
            formData,
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    async getEvidencias(idProyecto: number): Promise<EvidenciaResponse[]> {
        const response = await axios.get(
            `${API_URL}/proyectos/${idProyecto}/evidencias`,
            {
                headers: getAuthHeader(),
            }
        );
        return response.data;
    },

    async deleteEvidencia(idEvidencia: number): Promise<void> {
        await axios.delete(`${API_URL}/evidencias/${idEvidencia}`, {
            headers: getAuthHeader(),
        });
    },

    async downloadEvidencia(idEvidencia: number, fileName: string): Promise<void> {
        const response = await axios.get(`${API_URL}/evidencias/${idEvidencia}/archivo`, {
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

import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8080/api';

export interface EvidenciaResponse {
    idEvidencia: number;
    idProyecto: number;
    nombreProyecto: string;
    url: string;
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
};

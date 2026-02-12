import axios from 'axios';

const API_URL = 'http://localhost:8081/api/trl';

export interface TRLDocument {
    id: number;
    filename: string;
    originalPath: string;
    fileType: string;
    fileSize: number;
    title: string | null;
    author: string | null;
    status: string;
    errorMessage: string | null;
    pageCount: number | null;
    wordCount: number | null;
    characterCount: number | null;
    createdAt: string;
    updatedAt: string;
    processingStartedAt: string | null;
    processingCompletedAt: string | null;
    metadataJson: string | null;
}

export const trlService = {
    async analyzeDocument(file: File): Promise<TRLDocument> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_URL}/analyze`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async getDocuments(): Promise<TRLDocument[]> {
        const response = await axios.get(`${API_URL}/documents`);
        return response.data;
    },

    async getDocumentById(id: number): Promise<TRLDocument> {
        const response = await axios.get(`${API_URL}/documents/${id}`);
        return response.data;
    }
};

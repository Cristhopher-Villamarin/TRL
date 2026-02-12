import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trlService, type TRLDocument } from '../services/trlService';
import { authService } from '../services/authService';
import './TRLAnalyzeView.css';

export default function TRLAnalyzeView() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [documents, setDocuments] = useState<TRLDocument[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }
        loadDocuments();
    }, [navigate]);

    const loadDocuments = async () => {
        try {
            setLoadingDocs(true);
            const data = await trlService.getDocuments();
            setDocuments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (err) {
            console.error('Error loading documents:', err);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        try {
            setIsAnalyzing(true);
            setError(null);
            await trlService.analyzeDocument(file);
            // Re-cargar documentos para ver el nuevo en estado PENDING
            loadDocuments();
            setFile(null);
            // Iniciar un loop de polling para actualizar el estado
            startPolling();
        } catch (err: any) {
            console.error('Error starting analysis:', err);
            setError('Error al iniciar el an\u00e1lisis. Por favor, intente de nuevo.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const startPolling = () => {
        const interval = setInterval(async () => {
            const data = await trlService.getDocuments();
            setDocuments(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

            // Si ya no hay ning\u00fan documento en PENDING, detener polling
            const stillPending = data.some(doc => doc.status === 'PENDING');
            if (!stillPending) {
                clearInterval(interval);
            }
        }, 3000);

        // Limpiar despu\u00e9s de 2 minutos por seguridad
        setTimeout(() => clearInterval(interval), 120000);
    };

    return (
        <div className="analyze-container">
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <nav className="dashboard-nav">
                <div className="nav-brand" onClick={() => navigate('/usuario')} style={{ cursor: 'pointer' }}>
                    <div className="nav-logo">TRL</div>
                    <span>An\u00e1lisis de Documentos</span>
                </div>
                <button onClick={() => navigate('/usuario')} className="back-button">
                    Volver al Dashboard
                </button>
            </nav>

            <div className="analyze-content">
                <header className="analyze-header">
                    <h1>M\u00f3dulo de An\u00e1lisis TRL (IA)</h1>
                    <p>Sube tus documentos t\u00e9cnicos (PDF) para que nuestra IA determine el nivel de madurez tecnol\u00f3gica.</p>
                </header>

                <div className="upload-section">
                    <div className={`upload-card ${isAnalyzing ? 'analyzing' : ''}`}>
                        <div className="upload-icon">
                            {isAnalyzing ? (
                                <div className="spinner-large"></div>
                            ) : (
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 16L12 8M12 8L9 11M12 8L15 11M4 15V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V15M4 9V7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <h3>{isAnalyzing ? 'Analizando Documento...' : 'Subir Documento'}</h3>
                        <p>Selecciona un archivo PDF para procesar con Google Gemini 2.0</p>

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            id="file-upload"
                            disabled={isAnalyzing}
                        />
                        <label htmlFor="file-upload" className={`file-label ${file ? 'has-file' : ''}`}>
                            {file ? file.name : 'Elegir Archivo'}
                        </label>

                        {error && <div className="error-message">{error}</div>}

                        <button
                            className="analyze-button"
                            onClick={handleAnalyze}
                            disabled={!file || isAnalyzing}
                        >
                            {isAnalyzing ? 'Iniciando fase de IA...' : 'Iniciar An\u00e1lisis'}
                        </button>
                    </div>
                </div>

                <div className="history-section">
                    <h2>Historial de An\u00e1lisis</h2>
                    <div className="docs-grid">
                        {loadingDocs ? (
                            <div className="loading-state">
                                <div className="spinner-small"></div>
                                <p>Cargando historial...</p>
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="empty-state">
                                <p>No has realizado ning\u00fan an\u00e1lisis a\u00fan.</p>
                            </div>
                        ) : (
                            <div className="docs-table-container">
                                <table className="docs-table">
                                    <thead>
                                        <tr>
                                            <th>Archivo</th>
                                            <th>Estado</th>
                                            <th>Fecha</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.map((doc) => (
                                            <tr key={doc.id}>
                                                <td className="doc-filename">{doc.filename}</td>
                                                <td>
                                                    <span className={`status-badge ${doc.status.toLowerCase()}`}>
                                                        {doc.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(doc.createdAt).toLocaleString()}</td>
                                                <td>
                                                    <button
                                                        className="view-btn"
                                                        disabled={doc.status !== 'COMPLETED'}
                                                        title={doc.status === 'COMPLETED' ? 'Ver Reporte' : 'Pendiente'}
                                                    >
                                                        Ver Reporte
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

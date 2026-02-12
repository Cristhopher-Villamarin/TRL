import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { proyectoService, type ProyectoResponse } from '../services/proyectoService';
import { evidenciaService, type EvidenciaResponse } from '../services/evidenciaService';
import './ProjectDetail.css';

export default function ProjectDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [proyecto, setProyecto] = useState<ProyectoResponse | null>(null);
    const [evidencias, setEvidencias] = useState<EvidenciaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingEvidencias, setLoadingEvidencias] = useState(false);
    const [error, setError] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [descripcion, setDescripcion] = useState('');
    const [estadoEvidencia, setEstadoEvidencia] = useState('Activa');
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProyecto(parseInt(id));
            fetchEvidencias(parseInt(id));
        }
    }, [id]);

    const handleAnalyzeProject = async () => {
        if (!proyecto) return;

        setAnalyzing(true);
        setError('');
        try {
            const message = await proyectoService.analizarProyecto(proyecto.idProyecto);
            alert(message);
        } catch (err: any) {
            setError(err.response?.data || 'Error al iniciar el análisis');
        } finally {
            setAnalyzing(false);
        }
    };

    const fetchProyecto = async (projectId: number) => {
        try {
            setLoading(true);
            const data = await proyectoService.getProyectoById(projectId);
            setProyecto(data);
        } catch (err: any) {
            setError(err.response?.data || 'Error al cargar el proyecto');
        } finally {
            setLoading(false);
        }
    };

    const fetchEvidencias = async (projectId: number) => {
        try {
            setLoadingEvidencias(true);
            const data = await evidenciaService.getEvidencias(projectId);
            setEvidencias(data);
        } catch (err: any) {
            console.error('Error al cargar evidencias:', err);
        } finally {
            setLoadingEvidencias(false);
        }
    };

    const handleBack = () => {
        navigate('/usuario/mis-proyectos');
    };

    const handleDelete = async () => {
        if (!proyecto) return;

        if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
            try {
                await proyectoService.deleteProyecto(proyecto.idProyecto);
                navigate('/usuario/mis-proyectos');
            } catch (err: any) {
                setError(err.response?.data || 'Error al eliminar el proyecto');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !proyecto) return;

        setUploading(true);
        setUploadError('');
        setUploadSuccess(false);

        try {
            await evidenciaService.uploadEvidencia(
                proyecto.idProyecto,
                selectedFile,
                descripcion,
                estadoEvidencia
            );
            setUploadSuccess(true);
            setSelectedFile(null);
            setDescripcion('');
            setEstadoEvidencia('Activa');
            setShowUploadForm(false);

            // Recargar evidencias
            fetchEvidencias(proyecto.idProyecto);

            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (err: any) {
            setUploadError(err.response?.data || 'Error al subir el archivo');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteEvidencia = async (idEvidencia: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta evidencia?')) {
            try {
                await evidenciaService.deleteEvidencia(idEvidencia);
                if (proyecto) {
                    fetchEvidencias(proyecto.idProyecto);
                }
            } catch (err: any) {
                setUploadError(err.response?.data || 'Error al eliminar la evidencia');
            }
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container project-detail-container">
                <div className="dashboard-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                </div>
                <div className="loading-container">
                    <div className="spinner-large"></div>
                    <p>Cargando proyecto...</p>
                </div>
            </div>
        );
    }

    if (error || !proyecto) {
        return (
            <div className="dashboard-container project-detail-container">
                <div className="dashboard-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                </div>
                <div className="dashboard-content">
                    <div className="error-state">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
                        </svg>
                        <h3>Error al cargar el proyecto</h3>
                        <p>{error || 'Proyecto no encontrado'}</p>
                        <button onClick={handleBack} className="back-button-error">
                            Volver a Mis Proyectos
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container project-detail-container">
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <div className="nav-logo">TRL</div>
                    <span>Detalle del Proyecto</span>
                </div>
                <button onClick={handleBack} className="back-button">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 18L2 10L10 2M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Volver
                </button>
            </nav>

            <div className="dashboard-content">
                <div className="project-detail-header">
                    <div>
                        <div className="project-type-badge">{proyecto.tipoProyecto}</div>
                        <h1>{proyecto.nombreProyecto}</h1>
                    </div>
                    <div className="header-actions">
                        <button
                            onClick={handleAnalyzeProject}
                            className={`analyze-button ${analyzing ? 'analyzing' : ''}`}
                            disabled={analyzing}
                        >
                            {analyzing ? (
                                <div className="spinner-small"></div>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            {analyzing ? 'Analizando...' : 'Analizar con IA'}
                        </button>
                        <button onClick={handleDelete} className="delete-button">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor" />
                            </svg>
                            Eliminar
                        </button>
                    </div>
                </div>

                <div className="project-info-grid">
                    <div className="info-card">
                        <h2>Información General</h2>
                        <div className="info-content">
                            <div className="info-item">
                                <label>Nombre del Proyecto</label>
                                <p>{proyecto.nombreProyecto}</p>
                            </div>
                            <div className="info-item">
                                <label>Tipo de Proyecto</label>
                                <p>{proyecto.tipoProyecto}</p>
                            </div>
                            <div className="info-item">
                                <label>Responsable</label>
                                <p>{proyecto.responsable}</p>
                            </div>
                            <div className="info-item">
                                <label>Tipología</label>
                                <p>{proyecto.tipologia}</p>
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <h2>Detalles Académicos</h2>
                        <div className="info-content">
                            <div className="info-item">
                                <label>Área de Investigación</label>
                                <p>{proyecto.areaInvestigacion}</p>
                            </div>
                            <div className="info-item">
                                <label>Departamento</label>
                                <p>{proyecto.departamento}</p>
                            </div>
                            <div className="info-item">
                                <label>Carrera</label>
                                <p>{proyecto.carrera}</p>
                            </div>
                            <div className="info-item">
                                <label>Duración</label>
                                <p>{proyecto.duracionMeses} meses</p>
                            </div>
                        </div>
                    </div>

                    <div className="info-card info-card-full">
                        <h2>Línea de Investigación</h2>
                        <div className="info-content">
                            <div className="info-item">
                                <p className="description-text">{proyecto.lineaInvestigacion}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Evidencias */}
                    <div className="info-card info-card-full evidencias-section">
                        <div className="evidencias-header">
                            <h2>Evidencias del Proyecto</h2>
                            <button
                                onClick={() => setShowUploadForm(!showUploadForm)}
                                className="add-evidence-button"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 0L10 20M0 10L20 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Añadir Evidencia
                            </button>
                        </div>

                        {uploadSuccess && (
                            <div className="success-message">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor" />
                                </svg>
                                ¡Evidencia subida exitosamente!
                            </div>
                        )}

                        {uploadError && (
                            <div className="error-message">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor" />
                                </svg>
                                {uploadError}
                            </div>
                        )}

                        {showUploadForm && (
                            <form onSubmit={handleUploadSubmit} className="upload-form">
                                <div className="form-group">
                                    <label htmlFor="file">Archivo *</label>
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={handleFileChange}
                                        required
                                        disabled={uploading}
                                        className="file-input"
                                    />
                                    {selectedFile && (
                                        <p className="file-name">Archivo seleccionado: {selectedFile.name}</p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="descripcion">Descripción *</label>
                                    <textarea
                                        id="descripcion"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        required
                                        disabled={uploading}
                                        placeholder="Describe la evidencia"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="estadoEvidencia">Estado *</label>
                                    <select
                                        id="estadoEvidencia"
                                        value={estadoEvidencia}
                                        onChange={(e) => setEstadoEvidencia(e.target.value)}
                                        required
                                        disabled={uploading}
                                    >
                                        <option value="Activa">Activa</option>
                                        <option value="Inactiva">Inactiva</option>
                                        <option value="Pendiente">Pendiente</option>
                                    </select>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadForm(false)}
                                        className="cancel-button"
                                        disabled={uploading}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="submit-button" disabled={uploading}>
                                        {uploading ? (
                                            <>
                                                <div className="spinner"></div>
                                                Subiendo...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M10 0L10 12M10 0L6 4M10 0L14 4M2 12L2 18L18 18L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Subir Evidencia
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="evidencias-list">
                            {loadingEvidencias ? (
                                <div className="loading-evidencias">
                                    <div className="spinner-small"></div>
                                    <p>Cargando evidencias...</p>
                                </div>
                            ) : evidencias.length === 0 ? (
                                <div className="empty-evidencias">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor" />
                                    </svg>
                                    <p>No hay evidencias aún</p>
                                    <span>Añade la primera evidencia del proyecto</span>
                                </div>
                            ) : (
                                <div className="evidencias-grid">
                                    {evidencias.map((evidencia) => (
                                        <div key={evidencia.idEvidencia} className="evidencia-card">
                                            <div className="evidencia-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor" />
                                                </svg>
                                            </div>
                                            <div className="evidencia-info">
                                                <h4>{evidencia.descripcion}</h4>
                                                <p className="evidencia-filename">{evidencia.archivoNombre}</p>
                                                <p className="evidencia-date">
                                                    Subido: {new Date(evidencia.fechaCarga).toLocaleDateString('es-ES')}
                                                </p>
                                                <span className={`evidencia-status ${evidencia.estadoEvidencia.toLowerCase()}`}>
                                                    {evidencia.estadoEvidencia}
                                                </span>
                                            </div>
                                            <div className="evidencia-actions">
                                                <button
                                                    onClick={() => evidenciaService.downloadEvidencia(evidencia.idEvidencia, evidencia.archivoNombre)}
                                                    className="view-button"
                                                    title="Descargar evidencia"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvidencia(evidencia.idEvidencia)}
                                                    className="delete-evidence-button"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

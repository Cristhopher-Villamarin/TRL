import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { nivelTRLService, type NivelTRLResponse } from '../services/nivelTRLService';
import { criterioService, type CriterioRequest, type CriterioResponse } from '../services/criterioService';
import './CriteriaManagement.css';

export default function CriteriaManagement() {
    const [niveles, setNiveles] = useState<NivelTRLResponse[]>([]);
    const [selectedNivel, setSelectedNivel] = useState<NivelTRLResponse | null>(null);
    const [criterios, setCriterios] = useState<CriterioResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingCriterios, setLoadingCriterios] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingCriterio, setEditingCriterio] = useState<CriterioResponse | null>(null);
    const [deletingCriterio, setDeletingCriterio] = useState<CriterioResponse | null>(null);
    const [formData, setFormData] = useState<CriterioRequest>({
        idNivel: 0,
        nombreCriterio: '',
        puntajeCriterio: 0,
        importancia: 'Media',
        justificacion: '',
        estadoEvidencia: 'Pendiente'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.rol !== 'ADMIN') {
            navigate('/login');
            return;
        }
        loadNiveles();
    }, [navigate]);

    const loadNiveles = async () => {
        try {
            setLoading(true);
            const data = await nivelTRLService.getAll();
            setNiveles(data.sort((a, b) => a.numNivel - b.numNivel));
        } catch (err) {
            console.error('Error loading niveles:', err);
            setError('Error al cargar los niveles TRL');
        } finally {
            setLoading(false);
        }
    };

    const loadCriterios = async (idNivel: number) => {
        try {
            setLoadingCriterios(true);
            const data = await criterioService.getByNivel(idNivel);
            setCriterios(data);
        } catch (err) {
            console.error('Error loading criterios:', err);
            setError('Error al cargar los criterios');
        } finally {
            setLoadingCriterios(false);
        }
    };

    const handleSelectNivel = (nivel: NivelTRLResponse) => {
        setSelectedNivel(nivel);
        loadCriterios(nivel.idNivel);
        setError('');
    };

    const handleBackToNiveles = () => {
        setSelectedNivel(null);
        setCriterios([]);
        setError('');
    };

    const handleOpenModal = (criterio?: CriterioResponse) => {
        if (criterio) {
            setEditingCriterio(criterio);
            setFormData({
                idNivel: criterio.idNivel,
                nombreCriterio: criterio.nombreCriterio,
                puntajeCriterio: criterio.puntajeCriterio,
                importancia: criterio.importancia,
                justificacion: criterio.justificacion,
                estadoEvidencia: criterio.estadoEvidencia
            });
        } else {
            setEditingCriterio(null);
            setFormData({
                idNivel: selectedNivel?.idNivel || 0,
                nombreCriterio: '',
                puntajeCriterio: 0,
                importancia: 'Media',
                justificacion: '',
                estadoEvidencia: 'Pendiente'
            });
        }
        setShowModal(true);
        setError('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCriterio(null);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (editingCriterio) {
                await criterioService.update(editingCriterio.idCriterio, formData);
            } else {
                await criterioService.create(formData);
            }
            if (selectedNivel) {
                await loadCriterios(selectedNivel.idNivel);
            }
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data || 'Error al guardar el criterio');
        }
    };

    const handleOpenDeleteModal = (criterio: CriterioResponse) => {
        setDeletingCriterio(criterio);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletingCriterio(null);
    };

    const handleDelete = async () => {
        if (!deletingCriterio) return;

        try {
            await criterioService.delete(deletingCriterio.idCriterio);
            if (selectedNivel) {
                await loadCriterios(selectedNivel.idNivel);
            }
            handleCloseDeleteModal();
        } catch (err: any) {
            setError(err.response?.data || 'Error al eliminar el criterio');
            handleCloseDeleteModal();
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const getImportanciaClass = (importancia: string) => {
        switch (importancia.toLowerCase()) {
            case 'alta': return 'importancia-alta';
            case 'media': return 'importancia-media';
            case 'baja': return 'importancia-baja';
            default: return '';
        }
    };

    const getEstadoClass = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'completado': return 'estado-completado';
            case 'en progreso': return 'estado-progreso';
            case 'pendiente': return 'estado-pendiente';
            default: return '';
        }
    };

    return (
        <div className="dashboard-container criteria-management">
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <div className="nav-logo">TRL</div>
                    <span>Gestión de Criterios</span>
                </div>
                <div className="nav-actions">
                    <button onClick={() => navigate('/admin')} className="back-button">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 18L2 10L10 2L11.4 3.4L5.8 9H18V11H5.8L11.4 16.6L10 18Z" fill="currentColor" />
                        </svg>
                        Volver
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3 3C1.89543 3 1 3.89543 1 5V15C1 16.1046 1.89543 17 3 17H9V15H3V5H9V3H3ZM11 7L15 10L11 13V11H7V9H11V7Z" fill="currentColor" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            <div className="dashboard-content">
                {!selectedNivel ? (
                    <>
                        <div className="content-header">
                            <div>
                                <h1>Seleccionar Nivel TRL</h1>
                                <p>Selecciona un nivel TRL para gestionar sus criterios</p>
                            </div>
                        </div>

                        {error && (
                            <div className="error-banner">{error}</div>
                        )}

                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Cargando niveles TRL...</p>
                            </div>
                        ) : niveles.length === 0 ? (
                            <div className="empty-state">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor" />
                                </svg>
                                <h3>No hay niveles TRL registrados</h3>
                                <p>Primero debes crear niveles TRL</p>
                            </div>
                        ) : (
                            <div className="niveles-select-grid">
                                {niveles.map((nivel) => (
                                    <div
                                        key={nivel.idNivel}
                                        className="nivel-select-card"
                                        onClick={() => handleSelectNivel(nivel)}
                                    >
                                        <div className="nivel-select-header">
                                            <span className="nivel-badge-large">TRL {nivel.numNivel}</span>
                                        </div>
                                        <h3>{nivel.nomNivel}</h3>
                                        <p className="nivel-entorno">{nivel.entorno}</p>
                                        <div className="nivel-arrow">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="content-header">
                            <div className="header-with-back">
                                <button onClick={handleBackToNiveles} className="back-link">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor" />
                                    </svg>
                                    Volver a niveles
                                </button>
                                <div>
                                    <div className="selected-nivel-badge">TRL {selectedNivel.numNivel}</div>
                                    <h1>Criterios de {selectedNivel.nomNivel}</h1>
                                    <p>{selectedNivel.entorno} - {selectedNivel.faseDesarrollo}</p>
                                </div>
                            </div>
                            <button onClick={() => handleOpenModal()} className="add-button">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Añadir Criterio
                            </button>
                        </div>

                        {error && !showModal && (
                            <div className="error-banner">{error}</div>
                        )}

                        {loadingCriterios ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Cargando criterios...</p>
                            </div>
                        ) : criterios.length === 0 ? (
                            <div className="empty-state">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill="currentColor" />
                                </svg>
                                <h3>No hay criterios para este nivel</h3>
                                <p>Comienza agregando el primer criterio</p>
                            </div>
                        ) : (
                            <div className="criterios-grid">
                                {criterios.map((criterio) => (
                                    <div key={criterio.idCriterio} className="criterio-card">
                                        <div className="criterio-header">
                                            <span className={`importancia-badge ${getImportanciaClass(criterio.importancia)}`}>
                                                {criterio.importancia}
                                            </span>
                                            <div className="criterio-actions">
                                                <button onClick={() => handleOpenModal(criterio)} className="icon-button edit">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleOpenDeleteModal(criterio)} className="icon-button delete">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <h3>{criterio.nombreCriterio}</h3>
                                        <p className="criterio-justificacion">{criterio.justificacion}</p>
                                        <div className="criterio-details">
                                            <div className="detail-item">
                                                <label>Puntaje</label>
                                                <span className="puntaje-value">{criterio.puntajeCriterio}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Estado</label>
                                                <span className={`estado-badge ${getEstadoClass(criterio.estadoEvidencia)}`}>
                                                    {criterio.estadoEvidencia}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Formulario */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCriterio ? 'Editar Criterio' : 'Nuevo Criterio'}</h2>
                            <button onClick={handleCloseModal} className="close-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="error-message">{error}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nombre del Criterio *</label>
                                <input
                                    type="text"
                                    value={formData.nombreCriterio}
                                    onChange={(e) => setFormData({ ...formData, nombreCriterio: e.target.value })}
                                    required
                                    maxLength={100}
                                    placeholder="Nombre del criterio"
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Puntaje *</label>
                                    <input
                                        type="number"
                                        value={formData.puntajeCriterio}
                                        onChange={(e) => setFormData({ ...formData, puntajeCriterio: parseInt(e.target.value) })}
                                        required
                                        min="0"
                                        max="100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Importancia *</label>
                                    <select
                                        value={formData.importancia}
                                        onChange={(e) => setFormData({ ...formData, importancia: e.target.value })}
                                        required
                                    >
                                        <option value="Alta">Alta</option>
                                        <option value="Media">Media</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Estado de Evidencia *</label>
                                <select
                                    value={formData.estadoEvidencia}
                                    onChange={(e) => setFormData({ ...formData, estadoEvidencia: e.target.value })}
                                    required
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Progreso">En Progreso</option>
                                    <option value="Completado">Completado</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Justificación *</label>
                                <textarea
                                    value={formData.justificacion}
                                    onChange={(e) => setFormData({ ...formData, justificacion: e.target.value })}
                                    required
                                    maxLength={100}
                                    rows={3}
                                    placeholder="Justificación del criterio..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={handleCloseModal} className="cancel-button">
                                    Cancelar
                                </button>
                                <button type="submit" className="submit-button">
                                    {editingCriterio ? 'Actualizar' : 'Crear'} Criterio
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Eliminación */}
            {showDeleteModal && deletingCriterio && (
                <div className="modal-overlay" onClick={handleCloseDeleteModal}>
                    <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h2>¿Eliminar Criterio?</h2>
                        <p>
                            ¿Está seguro de eliminar el criterio <strong>"{deletingCriterio.nombreCriterio}"</strong>?
                            Esta acción no se puede deshacer.
                        </p>
                        <div className="modal-actions">
                            <button onClick={handleCloseDeleteModal} className="cancel-button">
                                Cancelar
                            </button>
                            <button onClick={handleDelete} className="delete-confirm-button">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

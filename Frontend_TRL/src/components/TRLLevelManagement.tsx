import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { nivelTRLService, type NivelTRLRequest, type NivelTRLResponse } from '../services/nivelTRLService';
import './TRLLevelManagement.css';

export default function TRLLevelManagement() {
    const [niveles, setNiveles] = useState<NivelTRLResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingNivel, setEditingNivel] = useState<NivelTRLResponse | null>(null);
    const [deletingNivel, setDeletingNivel] = useState<NivelTRLResponse | null>(null);
    const [formData, setFormData] = useState<NivelTRLRequest>({
        numNivel: 1,
        nomNivel: '',
        entorno: '',
        faseDesarrollo: '',
        puntajeMinimo: 0,
        descripcionTrl: ''
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

    const handleOpenModal = (nivel?: NivelTRLResponse) => {
        if (nivel) {
            setEditingNivel(nivel);
            setFormData({
                numNivel: nivel.numNivel,
                nomNivel: nivel.nomNivel,
                entorno: nivel.entorno,
                faseDesarrollo: nivel.faseDesarrollo,
                puntajeMinimo: nivel.puntajeMinimo,
                descripcionTrl: nivel.descripcionTrl
            });
        } else {
            setEditingNivel(null);
            setFormData({
                numNivel: niveles.length > 0 ? Math.max(...niveles.map(n => n.numNivel)) + 1 : 1,
                nomNivel: '',
                entorno: '',
                faseDesarrollo: '',
                puntajeMinimo: 0,
                descripcionTrl: ''
            });
        }
        setShowModal(true);
        setError('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingNivel(null);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (editingNivel) {
                await nivelTRLService.update(editingNivel.idNivel, formData);
            } else {
                await nivelTRLService.create(formData);
            }
            await loadNiveles();
            handleCloseModal();
        } catch (err: any) {
            setError(err.response?.data || 'Error al guardar el nivel TRL');
        }
    };

    const handleOpenDeleteModal = (nivel: NivelTRLResponse) => {
        setDeletingNivel(nivel);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletingNivel(null);
    };

    const handleDelete = async () => {
        if (!deletingNivel) return;

        try {
            await nivelTRLService.delete(deletingNivel.idNivel);
            await loadNiveles();
            handleCloseDeleteModal();
        } catch (err: any) {
            setError(err.response?.data || 'Error al eliminar el nivel TRL');
            handleCloseDeleteModal();
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container trl-management">
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <div className="nav-logo">TRL</div>
                    <span>Gestión de Niveles TRL</span>
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
                <div className="content-header">
                    <div>
                        <h1>Niveles TRL</h1>
                        <p>Gestiona los niveles de madurez tecnológica del sistema</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="add-button">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Añadir Nivel TRL
                    </button>
                </div>

                {error && !showModal && (
                    <div className="error-banner">
                        {error}
                    </div>
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
                        <p>Comienza agregando el primer nivel TRL</p>
                    </div>
                ) : (
                    <div className="niveles-grid">
                        {niveles.map((nivel) => (
                            <div key={nivel.idNivel} className="nivel-card">
                                <div className="nivel-header">
                                    <div className="nivel-number">TRL {nivel.numNivel}</div>
                                    <div className="nivel-actions">
                                        <button onClick={() => handleOpenModal(nivel)} className="icon-button edit">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleOpenDeleteModal(nivel)} className="icon-button delete">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <h3>{nivel.nomNivel}</h3>
                                <div className="nivel-details">
                                    <div className="detail-item">
                                        <label>Entorno</label>
                                        <span>{nivel.entorno}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Fase de Desarrollo</label>
                                        <span>{nivel.faseDesarrollo}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Puntaje Mínimo</label>
                                        <span>{nivel.puntajeMinimo}</span>
                                    </div>
                                </div>
                                <p className="nivel-description">{nivel.descripcionTrl}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Formulario */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingNivel ? 'Editar Nivel TRL' : 'Nuevo Nivel TRL'}</h2>
                            <button onClick={handleCloseModal} className="close-button">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Número de Nivel *</label>
                                    <input
                                        type="number"
                                        value={formData.numNivel}
                                        onChange={(e) => setFormData({ ...formData, numNivel: parseInt(e.target.value) })}
                                        required
                                        min="1"
                                        max="9"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Puntaje Mínimo *</label>
                                    <input
                                        type="number"
                                        value={formData.puntajeMinimo}
                                        onChange={(e) => setFormData({ ...formData, puntajeMinimo: parseInt(e.target.value) })}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Nombre del Nivel *</label>
                                <input
                                    type="text"
                                    value={formData.nomNivel}
                                    onChange={(e) => setFormData({ ...formData, nomNivel: e.target.value })}
                                    required
                                    maxLength={50}
                                    placeholder="Ej: Principios Básicos Observados"
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Entorno *</label>
                                    <input
                                        type="text"
                                        value={formData.entorno}
                                        onChange={(e) => setFormData({ ...formData, entorno: e.target.value })}
                                        required
                                        maxLength={20}
                                        placeholder="Ej: Laboratorio"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fase de Desarrollo *</label>
                                    <input
                                        type="text"
                                        value={formData.faseDesarrollo}
                                        onChange={(e) => setFormData({ ...formData, faseDesarrollo: e.target.value })}
                                        required
                                        maxLength={50}
                                        placeholder="Ej: Investigación Básica"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Descripción *</label>
                                <textarea
                                    value={formData.descripcionTrl}
                                    onChange={(e) => setFormData({ ...formData, descripcionTrl: e.target.value })}
                                    required
                                    rows={4}
                                    placeholder="Descripción detallada del nivel TRL..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={handleCloseModal} className="cancel-button">
                                    Cancelar
                                </button>
                                <button type="submit" className="submit-button">
                                    {editingNivel ? 'Actualizar' : 'Crear'} Nivel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Eliminación */}
            {showDeleteModal && deletingNivel && (
                <div className="modal-overlay" onClick={handleCloseDeleteModal}>
                    <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h2>¿Eliminar Nivel TRL?</h2>
                        <p>
                            ¿Está seguro de eliminar el nivel <strong>TRL {deletingNivel.numNivel} - {deletingNivel.nomNivel}</strong>?
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

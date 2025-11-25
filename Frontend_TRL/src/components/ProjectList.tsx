import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { proyectoService, type ProyectoResponse } from '../services/proyectoService';
import './ProjectList.css';

export default function ProjectList() {
    const navigate = useNavigate();
    const [proyectos, setProyectos] = useState<ProyectoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProyectos();
    }, []);

    const fetchProyectos = async () => {
        try {
            setLoading(true);
            const data = await proyectoService.getProyectos();
            setProyectos(data);
        } catch (err: any) {
            setError(err.response?.data || 'Error al cargar los proyectos');
        } finally {
            setLoading(false);
        }
    };

    const handleProjectClick = (id: number) => {
        navigate(`/usuario/proyecto/${id}`);
    };

    const handleBack = () => {
        navigate('/usuario');
    };

    const handleCreateNew = () => {
        navigate('/usuario/crear-proyecto');
    };

    return (
        <div className="dashboard-container project-list-container">
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <div className="nav-logo">TRL</div>
                    <span>Mis Proyectos</span>
                </div>
                <button onClick={handleBack} className="back-button">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 18L2 10L10 2M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Volver
                </button>
            </nav>

            <div className="dashboard-content">
                <div className="project-list-header">
                    <div>
                        <h1>Mis Proyectos</h1>
                        <p>Gestiona todos tus proyectos TRL</p>
                    </div>
                    <button onClick={handleCreateNew} className="create-button">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 0L10 20M0 10L20 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Nuevo Proyecto
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor" />
                        </svg>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner-large"></div>
                        <p>Cargando proyectos...</p>
                    </div>
                ) : proyectos.length === 0 ? (
                    <div className="empty-state-card">
                        <div className="empty-state">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V8H20V18Z" fill="currentColor" />
                            </svg>
                            <h3>No tienes proyectos aún</h3>
                            <p>Comienza creando tu primer proyecto TRL</p>
                            <button onClick={handleCreateNew} className="empty-create-button">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 0L10 20M0 10L20 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Crear Proyecto
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {proyectos.map((proyecto, index) => (
                            <div
                                key={proyecto.idProyecto}
                                className="project-card"
                                onClick={() => handleProjectClick(proyecto.idProyecto)}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="project-card-header">
                                    <div className="project-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <div className="project-badge">Proyecto</div>
                                </div>
                                <h3>{proyecto.nombreProyecto}</h3>
                                <div className="project-info">
                                    <div className="info-row">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="currentColor" />
                                        </svg>
                                        <span>{proyecto.responsable}</span>
                                    </div>
                                    <div className="info-row">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M14 2H12V0H10V2H6V0H4V2H2C0.89 2 0.00999999 2.9 0.00999999 4L0 14C0 15.1 0.89 16 2 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2ZM14 14H2V7H14V14ZM14 5H2V4H14V5Z" fill="currentColor" />
                                        </svg>
                                        <span>{proyecto.carrera}</span>
                                    </div>
                                </div>
                                <div className="project-footer">
                                    <span className="duration-badge">{proyecto.duracionMeses} meses</span>
                                    <svg className="arrow-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

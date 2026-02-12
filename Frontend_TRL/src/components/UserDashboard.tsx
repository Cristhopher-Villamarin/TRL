import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type AuthResponse } from '../services/authService';
import { nivelTRLService, type NivelTRLResponse } from '../services/nivelTRLService';
import './UserDashboard.css';

export default function UserDashboard() {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [niveles, setNiveles] = useState<NivelTRLResponse[]>([]);
    const [loadingNiveles, setLoadingNiveles] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        loadNiveles();
    }, [navigate]);

    const loadNiveles = async () => {
        try {
            setLoadingNiveles(true);
            const data = await nivelTRLService.getAll();
            setNiveles(data.sort((a, b) => a.numNivel - b.numNivel));
        } catch (err) {
            console.error('Error loading niveles:', err);
        } finally {
            setLoadingNiveles(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="dashboard-container user-dashboard">
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <div className="nav-logo">TRL</div>
                    <span>Portal de Usuario</span>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3 3C1.89543 3 1 3.89543 1 5V15C1 16.1046 1.89543 17 3 17H9V15H3V5H9V3H3ZM11 7L15 10L11 13V11H7V9H11V7Z" fill="currentColor" />
                    </svg>
                    Cerrar Sesión
                </button>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <div className="welcome-badge">Usuario</div>
                    <h1>Hola, {user.nombre} {user.apellido}</h1>

                </div>

                <div className="quick-actions">
                    <h2>Acciones Rápidas</h2>
                    <div className="actions-grid">
                        <button className="action-card" onClick={() => navigate('/usuario/crear-proyecto')}>
                            <div className="action-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
                                </svg>
                            </div>
                            <h3>Nuevo Proyecto</h3>
                            <p>Crear un nuevo proyecto TRL</p>
                        </button>

                        <button className="action-card" onClick={() => navigate('/usuario/mis-proyectos')}>
                            <div className="action-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V8H20V18Z" fill="currentColor" />
                                </svg>
                            </div>
                            <h3>Mis Proyectos</h3>
                            <p>Ver todos mis proyectos</p>
                        </button>

                        <button className="action-card" onClick={() => navigate('/usuario/reportes-trl')}>
                            <div className="action-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <h3>Reportes TRL</h3>
                            <p>Historial de análisis y diagnósticos PDF</p>
                        </button>
                    </div>
                </div>

                <div className="trl-levels-section">
                    <h2>Niveles TRL</h2>
                    <div className="trl-table-card">
                        {loadingNiveles ? (
                            <div className="table-loading">
                                <div className="spinner-small"></div>
                                <p>Cargando niveles TRL...</p>
                            </div>
                        ) : niveles.length === 0 ? (
                            <div className="table-empty">
                                <p>No hay niveles TRL disponibles</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="trl-table">
                                    <thead>
                                        <tr>
                                            <th>Nivel</th>
                                            <th>Nombre</th>
                                            <th>Entorno</th>
                                            <th>Fase de Desarrollo</th>
                                            <th>Puntaje Mínimo</th>
                                            <th>Descripción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {niveles.map((nivel) => (
                                            <tr key={nivel.idNivel}>
                                                <td>
                                                    <span className="nivel-badge">TRL {nivel.numNivel}</span>
                                                </td>
                                                <td className="nivel-name">{nivel.nomNivel}</td>
                                                <td>{nivel.entorno}</td>
                                                <td>{nivel.faseDesarrollo}</td>
                                                <td className="text-center">{nivel.puntajeMinimo}</td>
                                                <td className="descripcion-cell">{nivel.descripcionTrl}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="user-info-section">
                    <h2>Mi Información</h2>
                    <div className="info-card">
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Nombre Completo</label>
                                <p>{user.nombre} {user.apellido}</p>
                            </div>
                            <div className="info-item">
                                <label>Correo Electrónico</label>
                                <p>{user.correo}</p>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}

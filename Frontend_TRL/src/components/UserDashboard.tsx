import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type AuthResponse } from '../services/authService';
import './UserDashboard.css';

export default function UserDashboard() {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
    }, [navigate]);

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
                    <p className="user-email">{user.correo}</p>
                </div>

                <div className="quick-actions">
                    <h2>Acciones Rápidas</h2>
                    <div className="actions-grid">
                        <button className="action-card">
                            <div className="action-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
                                </svg>
                            </div>
                            <h3>Nuevo Proyecto</h3>
                            <p>Crear un nuevo proyecto TRL</p>
                        </button>

                        <button className="action-card">
                            <div className="action-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V8H20V18Z" fill="currentColor" />
                                </svg>
                            </div>
                            <h3>Mis Proyectos</h3>
                            <p>Ver todos mis proyectos</p>
                        </button>

                        <button className="action-card">
                            <div className="action-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor" />
                                </svg>
                            </div>
                            <h3>Reportes</h3>
                            <p>Ver mis reportes TRL</p>
                        </button>
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
                            <div className="info-item">
                                <label>Rol</label>
                                <p className="role-badge">{user.rol}</p>
                            </div>
                            <div className="info-item">
                                <label>ID de Usuario</label>
                                <p>#{user.idUsuario}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="recent-activity">
                    <h2>Actividad Reciente</h2>
                    <div className="activity-card">
                        <div className="empty-state">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
                            </svg>
                            <h3>No hay actividad reciente</h3>
                            <p>Comienza creando tu primer proyecto TRL</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

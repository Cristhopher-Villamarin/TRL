import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type AuthResponse } from '../services/authService';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [user, setUser] = useState<AuthResponse | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser || currentUser.rol !== 'ADMIN') {
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
        <div className="dashboard-container admin-dashboard">
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <div className="nav-logo">TRL</div>
                    <span>Admin Panel</span>
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
                    <div className="welcome-badge">Administrador</div>
                    <h1>Bienvenido, {user.nombre} {user.apellido}</h1>
                    <p className="user-email">{user.correo}</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon purple">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <h3>Usuarios</h3>
                            <p className="stat-value">-</p>
                            <p className="stat-label">Total de usuarios registrados</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <h3>Proyectos</h3>
                            <p className="stat-value">-</p>
                            <p className="stat-label">Proyectos evaluados</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <h3>Reportes</h3>
                            <p className="stat-value">-</p>
                            <p className="stat-label">Reportes generados</p>
                        </div>
                    </div>
                </div>

                <div className="admin-features">
                    <h2>Panel de Administración</h2>
                    <div className="features-grid">
                        <div className="feature-card" onClick={() => navigate('/admin/niveles-trl')}>
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor" />
                                </svg>
                            </div>
                            <div>
                                <h3>Gestión de Niveles TRL</h3>
                                <p>Administrar niveles de madurez tecnológica</p>
                            </div>
                        </div>

                        <div className="feature-card" onClick={() => navigate('/admin/criterios')}>
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor" />
                                </svg>
                            </div>
                            <div>
                                <h3>Gestión de Criterios</h3>
                                <p>Administrar criterios de evaluación por nivel TRL</p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor" />
                                </svg>
                            </div>
                            <div>
                                <h3>Gestión de Usuarios</h3>
                                <p>Administrar usuarios y permisos del sistema</p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V8H20V18Z" fill="currentColor" />
                                </svg>
                            </div>
                            <div>
                                <h3>Gestión de Proyectos</h3>
                                <p>Revisar y administrar todos los proyectos</p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor" />
                                </svg>
                            </div>
                            <div>
                                <h3>Reportes y Análisis</h3>
                                <p>Visualizar estadísticas y generar reportes</p>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor" />
                                </svg>
                            </div>
                            <div>
                                <h3>Configuración</h3>
                                <p>Configurar parámetros del sistema</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

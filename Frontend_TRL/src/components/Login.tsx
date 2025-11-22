import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Login.css';

export default function Login() {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ correo, contrasena });

            // Redirect based on role
            if (response.rol === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/usuario');
            }
        } catch (err: any) {
            setError(err.response?.data || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <div className="logo-icon">TRL</div>
                    </div>
                    <h1>Bienvenido</h1>
                    <p>Sistema de Evaluación TRL</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 4C1.89543 4 1 4.89543 1 6V14C1 15.1046 1.89543 16 3 16H17C18.1046 16 19 15.1046 19 14V6C19 4.89543 18.1046 4 17 4H3ZM3 6H17V6.42857L10 10.7143L3 6.42857V6ZM3 8.57143L10 12.8571L17 8.57143V14H3V8.57143Z" fill="currentColor" />
                            </svg>
                            <input
                                id="correo"
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                placeholder="usuario@espe.edu.ec"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="contrasena">Contraseña</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5 8V6C5 3.23858 7.23858 1 10 1C12.7614 1 15 3.23858 15 6V8H16C17.1046 8 18 8.89543 18 10V17C18 18.1046 17.1046 19 16 19H4C2.89543 19 2 18.1046 2 17V10C2 8.89543 2.89543 8 4 8H5ZM7 6V8H13V6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6Z" fill="currentColor" />
                            </svg>
                            <input
                                id="contrasena"
                                type="password"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? (
                            <div className="spinner"></div>
                        ) : (
                            <>
                                <span>Iniciar Sesión</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M13.4766 9.16658L9.00657 4.69657L10.1849 3.51823L16.6666 9.99992L10.1849 16.4816L9.00657 15.3033L13.4766 10.8333H3.33325V9.16658H13.4766Z" fill="currentColor" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>¿No tienes una cuenta?</p>
                    <button
                        onClick={() => navigate('/register')}
                        className="register-link"
                        disabled={loading}
                    >
                        Regístrate aquí
                    </button>
                </div>
            </div>
        </div>
    );
}

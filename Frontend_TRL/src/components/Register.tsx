import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.contrasena !== formData.confirmarContrasena) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.contrasena.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const { nombre, apellido, correo, contrasena } = formData;
            await authService.register({ nombre, apellido, correo, contrasena });
            navigate('/usuario');
        } catch (err: any) {
            setError(err.response?.data || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="register-card">
                <div className="register-header">
                    <div className="logo-container">
                        <div className="logo-icon">TRL</div>
                    </div>
                    <h1>Crear Cuenta</h1>
                    <p>Únete al Sistema de Evaluación TRL</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    {error && (
                        <div className="error-message">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Juan"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input
                                id="apellido"
                                name="apellido"
                                type="text"
                                value={formData.apellido}
                                onChange={handleChange}
                                placeholder="Pérez"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 4C1.89543 4 1 4.89543 1 6V14C1 15.1046 1.89543 16 3 16H17C18.1046 16 19 15.1046 19 14V6C19 4.89543 18.1046 4 17 4H3ZM3 6H17V6.42857L10 10.7143L3 6.42857V6ZM3 8.57143L10 12.8571L17 8.57143V14H3V8.57143Z" fill="currentColor" />
                            </svg>
                            <input
                                id="correo"
                                name="correo"
                                type="email"
                                value={formData.correo}
                                onChange={handleChange}
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
                                name="contrasena"
                                type="password"
                                value={formData.contrasena}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5 8V6C5 3.23858 7.23858 1 10 1C12.7614 1 15 3.23858 15 6V8H16C17.1046 8 18 8.89543 18 10V17C18 18.1046 17.1046 19 16 19H4C2.89543 19 2 18.1046 2 17V10C2 8.89543 2.89543 8 4 8H5ZM7 6V8H13V6C13 4.34315 11.6569 3 10 3C8.34315 3 7 4.34315 7 6Z" fill="currentColor" />
                            </svg>
                            <input
                                id="confirmarContrasena"
                                name="confirmarContrasena"
                                type="password"
                                value={formData.confirmarContrasena}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? (
                            <div className="spinner"></div>
                        ) : (
                            <>
                                <span>Crear Cuenta</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 3C10.5523 3 11 3.44772 11 4V9H16C16.5523 9 17 9.44772 17 10C17 10.5523 16.5523 11 16 11H11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11H4C3.44772 11 3 10.5523 3 10C3 9.44772 3.44772 9 4 9H9V4C9 3.44772 9.44772 3 10 3Z" fill="currentColor" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <div className="register-footer">
                    <p>¿Ya tienes una cuenta?</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="login-link"
                        disabled={loading}
                    >
                        Inicia sesión aquí
                    </button>
                </div>
            </div>
        </div>
    );
}

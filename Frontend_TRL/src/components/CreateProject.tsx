import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { proyectoService, type ProyectoRequest } from '../services/proyectoService';
import './CreateProject.css';

export default function CreateProject() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState<ProyectoRequest>({
        nombreProyecto: '',
        tipoProyecto: '',
        responsable: '',
        tipologia: '',
        areaInvestigacion: '',
        duracionMeses: 0,
        departamento: '',
        carrera: '',
        lineaInvestigacion: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'duracionMeses' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await proyectoService.createProyecto(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/usuario/mis-proyectos');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data || 'Error al crear el proyecto');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/usuario');
    };

    return (
        <div className="dashboard-container create-project-container">
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <div className="nav-logo">TRL</div>
                    <span>Nuevo Proyecto</span>
                </div>
                <button onClick={handleBack} className="back-button">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 18L2 10L10 2M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Volver
                </button>
            </nav>

            <div className="dashboard-content">
                <div className="create-project-header">
                    <h1>Crear Nuevo Proyecto</h1>
                    <p>Complete la información del proyecto TRL</p>
                </div>

                {success && (
                    <div className="success-message">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor" />
                        </svg>
                        ¡Proyecto creado exitosamente!
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor" />
                        </svg>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="project-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nombreProyecto">Nombre del Proyecto *</label>
                            <input
                                type="text"
                                id="nombreProyecto"
                                name="nombreProyecto"
                                value={formData.nombreProyecto}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Ingrese el nombre del proyecto"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipoProyecto">Tipo de Proyecto *</label>
                            <select
                                id="tipoProyecto"
                                name="tipoProyecto"
                                value={formData.tipoProyecto}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="">Seleccione un tipo</option>
                                <option value="Investigación Básica">Investigación Básica</option>
                                <option value="Investigación Aplicada">Investigación Aplicada</option>
                                <option value="Desarrollo Tecnológico">Desarrollo Tecnológico</option>
                                <option value="Innovación">Innovación</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="responsable">Responsable *</label>
                            <input
                                type="text"
                                id="responsable"
                                name="responsable"
                                value={formData.responsable}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Nombre del responsable"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipologia">Tipología *</label>
                            <select
                                id="tipologia"
                                name="tipologia"
                                value={formData.tipologia}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="">Seleccione una tipología</option>
                                <option value="Básica">Básica</option>
                                <option value="Aplicada">Aplicada</option>
                                <option value="Experimental">Experimental</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="areaInvestigacion">Área de Investigación *</label>
                            <input
                                type="text"
                                id="areaInvestigacion"
                                name="areaInvestigacion"
                                value={formData.areaInvestigacion}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Área de investigación"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="duracionMeses">Duración (meses) *</label>
                            <input
                                type="number"
                                id="duracionMeses"
                                name="duracionMeses"
                                value={formData.duracionMeses || ''}
                                onChange={handleChange}
                                required
                                min="1"
                                disabled={loading}
                                placeholder="Duración en meses"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="departamento">Departamento *</label>
                            <input
                                type="text"
                                id="departamento"
                                name="departamento"
                                value={formData.departamento}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Departamento"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="carrera">Carrera *</label>
                            <input
                                type="text"
                                id="carrera"
                                name="carrera"
                                value={formData.carrera}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Carrera"
                            />
                        </div>

                        <div className="form-group form-group-full">
                            <label htmlFor="lineaInvestigacion">Línea de Investigación *</label>
                            <textarea
                                id="lineaInvestigacion"
                                name="lineaInvestigacion"
                                value={formData.lineaInvestigacion}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                placeholder="Describa la línea de investigación"
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={handleBack} className="cancel-button" disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 0L12.09 6.26L18 6.27L13.18 10.27L15.18 16.27L10 12.77L4.82 16.27L6.82 10.27L2 6.27L7.91 6.26L10 0Z" fill="currentColor" />
                                    </svg>
                                    Crear Proyecto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

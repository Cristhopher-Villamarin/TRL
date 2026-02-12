import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { proyectoService, type ProyectoResponse } from '../services/proyectoService';
import { reporteService, type ReporteProyectoResponse } from '../services/reporteService';
import { authService } from '../services/authService';
import './TRLReportsView.css';

export default function TRLReportsView() {
    const [proyectos, setProyectos] = useState<ProyectoResponse[]>([]);
    const [selectedProyecto, setSelectedProyecto] = useState<number | null>(null);
    const [reportes, setReportes] = useState<ReporteProyectoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingReportes, setLoadingReportes] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchProyectos();
    }, [navigate]);

    const fetchProyectos = async () => {
        try {
            setLoading(true);
            const data = await proyectoService.getProyectos();
            setProyectos(data);
        } catch (err) {
            console.error('Error fetching proyectos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProyecto = async (id: number) => {
        setSelectedProyecto(id);
        try {
            setLoadingReportes(true);
            const data = await reporteService.getReportesByProyecto(id);
            setReportes(data.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()));
        } catch (err) {
            console.error('Error fetching reportes:', err);
        } finally {
            setLoadingReportes(false);
        }
    };

    return (
        <div className="reports-container">
            <div className="dashboard-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <nav className="dashboard-nav">
                <div className="nav-brand" onClick={() => navigate('/usuario')} style={{ cursor: 'pointer' }}>
                    <div className="nav-logo">TRL</div>
                    <span>Módulo de Reportes IA</span>
                </div>
                <button onClick={() => navigate('/usuario')} className="back-button">
                    Volver al Dashboard
                </button>
            </nav>

            <div className="reports-content">
                <header className="reports-header">
                    <h1>Reportes TRL</h1>
                    <p>Accede a los diagnósticos detallados generados por la IA para cada uno de tus proyectos.</p>
                </header>

                <div className="reports-grid">
                    {/* Lista de Proyectos */}
                    <div className="projects-sidebar card-glass">
                        <h2>Seleccionar Proyecto</h2>
                        {loading ? (
                            <div className="spinner-container"><div className="spinner-small"></div></div>
                        ) : proyectos.length === 0 ? (
                            <p className="empty-msg">No tienes proyectos creados.</p>
                        ) : (
                            <div className="project-list">
                                {proyectos.map(p => (
                                    <div
                                        key={p.idProyecto}
                                        className={`project-item ${selectedProyecto === p.idProyecto ? 'active' : ''}`}
                                        onClick={() => handleSelectProyecto(p.idProyecto)}
                                    >
                                        <h4>{p.nombreProyecto}</h4>
                                        <span>{p.tipoProyecto}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Lista de Reportes */}
                    <div className="reports-main card-glass">
                        {!selectedProyecto ? (
                            <div className="no-selection">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <h3>Selecciona un proyecto para ver sus reportes</h3>
                            </div>
                        ) : (
                            <>
                                <h2>Historial de Reportes</h2>
                                {loadingReportes ? (
                                    <div className="spinner-container"><div className="spinner-small"></div></div>
                                ) : reportes.length === 0 ? (
                                    <div className="empty-reports">
                                        <p>Aún no has generado reportes para este proyecto.</p>
                                        <button onClick={() => navigate(`/usuario/proyecto/${selectedProyecto}`)} className="go-analyze-btn">
                                            Ir a Analizar Proyecto
                                        </button>
                                    </div>
                                ) : (
                                    <div className="report-list">
                                        {reportes.map(r => (
                                            <div key={r.idReporte} className="report-card">
                                                <div className="report-info">
                                                    <div className="pdf-icon">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                            <polyline points="14 2 14 8 20 8" />
                                                        </svg>
                                                    </div>
                                                    <div className="text">
                                                        <h4>{r.nombreArchivo}</h4>
                                                        <span>{new Date(r.fechaCreacion).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="download-report-btn"
                                                    onClick={() => reporteService.downloadReporte(r.idReporte, r.nombreArchivo)}
                                                    title="Descargar PDF"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                                    </svg>
                                                    PDF
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

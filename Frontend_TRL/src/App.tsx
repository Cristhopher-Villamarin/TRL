import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import CreateProject from './components/CreateProject';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import TRLLevelManagement from './components/TRLLevelManagement';
import CriteriaManagement from './components/CriteriaManagement';
import TRLReportsView from './components/TRLReportsView';
import { authService } from './services/authService';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/usuario" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/niveles-trl"
          element={
            <ProtectedRoute adminOnly>
              <TRLLevelManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/criterios"
          element={
            <ProtectedRoute adminOnly>
              <CriteriaManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuario"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuario/crear-proyecto"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuario/mis-proyectos"
          element={
            <ProtectedRoute>
              <ProjectList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuario/proyecto/:id"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuario/reportes-trl"
          element={
            <ProtectedRoute>
              <TRLReportsView />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/auth.store.jsx';
import Layout from './Layout.jsx';

const ProtectedLayout = ({ children, roles }) => {
  const { user, loading } = useAuth();

  // ⏳ WAIT until auth is resolved
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  // ❌ Auth resolved → not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Role check
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

const ProtectedRoute = ({ children, roles }) => {
  return (
    <ProtectedLayout roles={roles}>
      {children}
    </ProtectedLayout>
  );
};

export default ProtectedRoute;

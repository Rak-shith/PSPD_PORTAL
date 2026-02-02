import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/auth.store.jsx';
import Layout from './Layout.jsx';

// Wrapper component that includes the Layout for all protected routes
const ProtectedLayout = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Route wrapper that uses the ProtectedLayout
const ProtectedRoute = ({ children, roles }) => {
  return (
    <ProtectedLayout roles={roles}>
      {children}
    </ProtectedLayout>
  );
};

export default ProtectedRoute;

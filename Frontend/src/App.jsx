import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/auth.store.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import HRUpdates from './pages/HRUpdates';
import HRAdminUpdates from './pages/admin/HRUpdates';
import HolidayCalendar from './pages/HolidayCalendar';
import CategoriesAdmin from './pages/admin/Categories';
import ApplicationsAdmin from './pages/admin/Applications';
import AccessRequestsAdmin from './pages/admin/AccessRequests';
import HolidaysAdmin from './pages/admin/Holidays';
import Contacts from './pages/Contacts';
import Support from './pages/Support';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes wrapped with Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/hr-updates" element={<HRUpdates />} />
            <Route path="/holidays" element={<HolidayCalendar />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/support" element={<Support />} />
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute roles={['HR_ADMIN']} />}>
            <Route path="/admin/hr-updates" element={<HRAdminUpdates />} />
            <Route path="/admin/holidays" element={<HolidaysAdmin />} />
          </Route>

          <Route element={<ProtectedRoute roles={['IT_ADMIN']} />}>
            <Route path="/admin/categories" element={<CategoriesAdmin />} />
            <Route path="/admin/applications" element={<ApplicationsAdmin />} />
            <Route path="/admin/access-requests" element={<AccessRequestsAdmin />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

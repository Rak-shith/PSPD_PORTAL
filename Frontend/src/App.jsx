import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/auth.store.jsx';
import { LoadingProvider } from './store/loading.store.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute';
import GlobalLoader from './components/common/GlobalLoader';
import Login from './pages/Login';
import Home from './pages/Home';
import HomeNew from './pages/HomeNew';
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
import AuthRedirect from './pages/AuthRedirect.jsx';

function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <GlobalLoader />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/login/redirect" element={<AuthRedirect />} />

            {/* Protected routes with Layout (no sidebar) */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/home" element={<HomeNew />} />
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
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/auth.store.jsx';
import Login from './pages/Login';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import ProtectedRoute from './components/layout/ProtectedRoute';
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
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />

          <Route path="/hr-updates" element={
            <ProtectedRoute>
              <HRUpdates />
            </ProtectedRoute>
          } />

          <Route path="/admin/hr-updates" element={
            <ProtectedRoute>
              <HRAdminUpdates />
            </ProtectedRoute>
          } />

          <Route
            path="/holidays"
            element={
              <ProtectedRoute>
                <HolidayCalendar />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/categories" element={
            <ProtectedRoute roles={['IT_ADMIN']}>
              <CategoriesAdmin />
            </ProtectedRoute>
          } />

          <Route path="/admin/applications" element={
            <ProtectedRoute roles={['IT_ADMIN']}>
              <ApplicationsAdmin />
            </ProtectedRoute>
          } />

          <Route path="/admin/access-requests" element={
            <ProtectedRoute roles={['IT_ADMIN']}>
              <AccessRequestsAdmin />
            </ProtectedRoute>
          } />

          <Route path="/admin/holidays" element={
            <ProtectedRoute roles={['HR_ADMIN']}>
              <HolidaysAdmin />
            </ProtectedRoute>
          } />

          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

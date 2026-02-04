import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';

const Layout = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-itc-bg">
      {/* Top Navigation Bar */}
      <header className="bg-itc-surface border-b border-itc-border sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-itc-text-primary">ITC-PSPD Portal</h1>
            </div>

            {/* Right Side - Navigation Links + Widgets */}
            <div className="flex items-center gap-6">
              {/* Navigation Links */}
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => navigate('/home')}
                  className="px-4 py-2 text-sm font-medium text-itc-text-secondary hover:text-itc-blue transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/favorites')}
                  className="px-4 py-2 text-sm font-medium text-itc-text-secondary hover:text-itc-blue transition-colors"
                >
                  Favorites
                </button>
                <button
                  onClick={() => navigate('/contacts')}
                  className="px-4 py-2 text-sm font-medium text-itc-text-secondary hover:text-itc-blue transition-colors"
                >
                  Contacts
                </button>
                <button
                  onClick={() => navigate('/support')}
                  className="px-4 py-2 text-sm font-medium text-itc-text-secondary hover:text-itc-blue transition-colors"
                >
                  Support
                </button>
                {(user?.role === 'HR_ADMIN' || user?.role === 'IT_ADMIN') && (
                  <button
                    onClick={() => {
                      if (user.role === 'HR_ADMIN') navigate('/admin/hr-updates');
                      if (user.role === 'IT_ADMIN') navigate('/admin/categories');
                    }}
                    className="px-4 py-2 text-sm font-medium text-itc-text-secondary hover:text-itc-blue transition-colors"
                  >
                    Admin
                  </button>
                )}
              </nav>

              {/* Divider */}
              <div className="h-8 w-px bg-itc-border"></div>

              {/* Widget Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/hr-updates')}
                  className="px-4 py-2 bg-itc-blue text-white text-sm font-semibold rounded-lg hover:bg-itc-blue-dark transition-colors"
                >
                  HR Updates
                </button>
                <button
                  onClick={() => navigate('/holidays')}
                  className="px-4 py-2 bg-itc-surface border border-itc-border text-itc-text-primary text-sm font-semibold rounded-lg hover:border-itc-blue hover:text-itc-blue transition-colors"
                >
                  Holiday Calendar
                </button>
              </div>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-px bg-itc-border"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-itc-blue flex items-center justify-center text-white text-sm font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-itc-text-secondary rounded-lg hover:bg-itc-bg hover:text-itc-danger transition-colors"
                    title="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

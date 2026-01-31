import { Link } from 'react-router-dom';
import { useAuth } from '../../store/auth.store.jsx';

export default function Sidebar() {
    const { user, logout } = useAuth();

    return (
        <div className="w-64 bg-white h-screen shadow">
            <div className="p-4 font-bold">ITC PSPD</div>
            <nav className="p-4 space-y-2">
                <Link to="/">Home</Link>
                <Link to="/favorites">Favorites</Link>
                <Link to="/hr-updates">HR Updates</Link>
                <Link to="/contacts">Contacts</Link>
                <Link to="/support">Support</Link>
                <Link to="/holidays">Holiday Calendar</Link>

                {user.role === 'HR_ADMIN' && (
                    <>
                        <Link to="/admin/hr-updates">HR Admin</Link>
                        <Link to="/admin/holidays">Holidays Admin</Link>
                    </>
                )}
                {user.role === 'IT_ADMIN' && (
                    <>
                        <Link to="/admin/categories">Categories</Link>
                        <Link to="/admin/applications">Applications</Link>
                        <Link to="/admin/access-requests">Access Requests</Link>
                    </>
                )}
            </nav>
            <button onClick={logout} className="m-4 text-red-600">
                Logout
            </button>
        </div>
    );
}

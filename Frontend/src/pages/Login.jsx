import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../store/auth.store.jsx';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../api/authConfig';

export default function Login() {
  const { instance } = useMsal();
  const [email, setEmail] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // If user is already logged in (in our app state), redirect to home
  useEffect(() => {
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [user, navigate]);

  const submit = async () => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email });
      login(res.data);
      window.location.href = '/home';
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        redirectUri: 'http://localhost:5173/login/redirect', // Explicitly force the correct URI
        prompt: 'select_account',
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-itc-bg">
      <div className="bg-itc-surface w-full max-w-md rounded-lg shadow-lg border border-itc-border p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-h1 font-semibold text-itc-text-primary">
            ITC PSPD Portal
          </h2>
          <p className="text-muted mt-1">
            Internal access for employees
          </p>
        </div>

        {/* Email Login */}
        <div className="mb-6">
          <label className="block text-muted mb-1">
            Email (Temporary Login)
          </label>
          <input
            className="w-full border border-itc-border rounded-md px-3 py-2
                       bg-itc-surface text-body
                       focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
            placeholder="name@itc.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-itc-blue hover:bg-itc-blue-dark
                     text-white py-2 rounded-md font-medium transition mb-4"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-itc-border" />
          <span className="text-muted text-sm">OR</span>
          <div className="flex-1 h-px bg-itc-border" />
        </div>

        {/* SSO Login */}
        <button
          onClick={handleRedirect}
          className="w-full border border-itc-blue text-itc-blue
                     hover:bg-itc-blue hover:text-white
                     py-2 rounded-md font-medium transition"
        >
          Login with SSO
        </button>

        <p className="text-center text-muted text-sm mt-6">
          Authorized ITC employees only
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../store/auth.store.jsx';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    const res = await api.post('/auth/login', { email });
    login(res.data);
    navigate('/');
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          className="border p-2 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          onClick={submit}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import api from '../api/axios';
import { useAuth } from '../store/auth.store';

export default function AuthRedirect() {
    const { instance } = useMsal();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        async function handleAuth() {
            const account = instance.getActiveAccount();

            if (!account) {
                navigate('/login', { replace: true });
                return;
            }

            try {
                const res = await api.post('/auth/login', { email: account.username });

                // Update auth state
                login(res.data);

                // Wait for next tick to ensure state is updated
                await new Promise(resolve => setTimeout(resolve, 50));

                // Now navigate
                navigate('/home', { replace: true });
            } catch (error) {
                console.error('Login failed:', error);
                navigate('/login', { replace: true });
            } finally {
                setIsProcessing(false);
            }
        }

        handleAuth();
    }, [instance, login, navigate]);

    if (!isProcessing) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-itc-bg">
            <p className="text-muted text-lg">Signing you in…</p>
        </div>
    );
}

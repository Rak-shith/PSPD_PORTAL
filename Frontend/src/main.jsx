import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './api/authConfig.js'
import api from './api/axios'

// Flag to prevent double initialization
let isBootstrapping = false;
let hasBootstrapped = false;

// Initialize MSAL before rendering
async function bootstrap() {
  // Prevent double execution
  if (isBootstrapping || hasBootstrapped) {
    return;
  }

  isBootstrapping = true;

  try {
    // ✅ 1. INITIALIZE MSAL FIRST (MANDATORY)
    await msalInstance.initialize();

    // ✅ 2. NOW process redirect response (only once!)
    const response = await msalInstance.handleRedirectPromise();

    if (response?.account) {
      msalInstance.setActiveAccount(response.account);

      // 🔥 AUTO-LOGIN LOGIC HERE
      try {
        const res = await api.post('/auth/login', { email: response.account.username });

        // Write directly to localStorage so AuthProvider picks it up immediately
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } catch (loginErr) {
        console.error('[Bootstrap] Backend login failed:', loginErr);
      }

    }

    hasBootstrapped = true;

  } catch (err) {
    console.error('[Bootstrap] MSAL initialization error:', err);
  } finally {
    isBootstrapping = false;
  }

  // Only render once
  if (!document.getElementById('root').hasChildNodes()) {
    createRoot(document.getElementById('root')).render(
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    );
  }
}

bootstrap();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ApiProvider } from './shared/api/query';
import { AuthProvider } from './shared/auth/session';
import { NavigationProvider } from './shared/state/navigation';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('root element missing');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

createRoot(rootEl).render(
  <StrictMode>
    <ApiProvider>
      <AuthProvider>
        <NavigationProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </NavigationProvider>
      </AuthProvider>
    </ApiProvider>
  </StrictMode>,
);

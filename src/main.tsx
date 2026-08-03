import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App';
import { ApiProvider } from './shared/api/query';
import { CookieAuthProvider } from './shared/auth/AuthContext';
import { NavigationProvider } from './shared/state/navigation';
import { Toaster } from './shared/components/ui/toast';
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
      <CookieAuthProvider>
        <NavigationProvider>
          <HashRouter>
            <Toaster>
              <App />
            </Toaster>
          </HashRouter>
        </NavigationProvider>
      </CookieAuthProvider>
    </ApiProvider>
  </StrictMode>,
);

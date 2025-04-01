import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          className: 'bg-amber-900/90 text-amber-100',
          style: {
            background: 'rgba(120, 53, 15, 0.9)',
            color: 'rgb(254, 243, 199)',
            border: 'none',
          },
        }}
      />
    </ErrorBoundary>
  </StrictMode>
);
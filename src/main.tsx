import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Immediately enforce class-based dark mode
document.documentElement.classList.add('dark');

const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to locate root element (#root) in document');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

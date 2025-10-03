import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './index.css';
import './i18n'; // ✅ make sure i18n is initialized before App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import WhiteFlight from './components/WhiteFlight/WhiteFlight.jsx';
import './demo.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WhiteFlight style={{ height: '100dvh' }} />
  </React.StrictMode>
);

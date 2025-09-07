import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById('root')!;
const root = createRoot(container); // 한 번만 createRoot 호출
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

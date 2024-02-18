import { createRoot } from 'react-dom/client';
import App from './App';
import { StrictMode } from 'react';
import './global.css';

const domNode = document.getElementById('root') as HTMLElement;
const root = createRoot(domNode);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

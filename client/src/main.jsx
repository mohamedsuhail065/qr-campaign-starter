import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

console.log('main.jsx loaded');
window.onerror = (msg, url, line) => {
  document.body.innerHTML = `<div style="color:red;padding:20px;"><h1>JS Error:</h1><p>${msg}</p><p>at ${url}:${line}</p></div>`;
};

console.log('Attempting to render...');
const root = document.getElementById('root');
if (!root) {
  console.error('Root element not found!');
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log('Render called');
}

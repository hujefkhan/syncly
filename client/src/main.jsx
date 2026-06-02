import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

const savedColorTheme =
  localStorage.getItem('colorTheme');

if (savedColorTheme === 'cozy') {
  document.documentElement.classList.add(
    'theme-cozy'
  );
}

if (
  localStorage.getItem('theme') === 'dark'
) {
  document.documentElement.classList.add(
    'dark'
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
  <GoogleOAuthProvider
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
  >
    <BrowserRouter>
      <Toaster position="top-center" />
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
</React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import CombinedProvider from './Context';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = ''; // Replace with your actual Client ID

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <CombinedProvider>
          <App />
        </CombinedProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

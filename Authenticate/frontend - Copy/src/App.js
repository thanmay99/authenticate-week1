import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './Context'; // Import both AuthProvider and AuthContext
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/Home';

function App() {
  const { token } = useContext(AuthContext); // Access token from AuthContext

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/"
        element={token ? <Home /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

// Use AuthProvider to wrap the app if you prefer to keep it in App.js
const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;

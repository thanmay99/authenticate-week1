import React, { useState, useContext, useEffect, useCallback } from 'react'; // <-- Added useCallback import
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context';
import './common.css';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign-in failed');
      }

      const { token } = await response.json();
      login(token);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  // Memoized handleGoogleSignin using useCallback
  const handleGoogleSignin = useCallback(async (response) => {
    const token = response.credential; // Google ID Token

    try {
      const res = await fetch('http://localhost:5000/auth/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Google Sign-In failed');
      }

      const { token: jwtToken } = await res.json();
      login(jwtToken);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  }, [login, navigate]);

  useEffect(() => {
    // Initialize Google Sign-In button
    window.google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
      callback: handleGoogleSignin, // Function to handle Google response
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'), 
      { theme: 'outline', size: 'large' } // Customize button appearance
    );
  }, [handleGoogleSignin]); // <-- handleGoogleSignin is now stable due to useCallback

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign In</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="form-control"
          />
        </div>
        <button type="submit" className="submit-button">Sign In</button>
      </form>
      {/* Google Sign-In button */}
      <div id="google-signin-button"></div>
      <button className="signin-redirect-button" onClick={() => navigate('/signup')}>
        Don't have an account? Sign Up
      </button>
    </div>
  );
}

export default Signin;

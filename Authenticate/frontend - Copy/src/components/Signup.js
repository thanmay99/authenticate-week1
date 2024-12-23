import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './common.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, phoneNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Sign-up failed');
        return;
      }

      navigate('/signin');
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignup = (response) => {
    setError('');
    const token = response.credential;
    try {
      fetch('http://localhost:5000/auth/google-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            navigate('/');
          } else {
            setError('Google Sign-Up failed');
          }
        });
    } catch (error) {
      setError(error.message);
    }
  };

  // Initialize Google Sign-In button after component mounts
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
      callback: handleGoogleSignup,
    });
    window.google.accounts.id.renderButton(document.getElementById('google-signin-button'), {
      theme: 'outline',
      size: 'large',
    });
  }, []);

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create Your Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
      <div id="google-signin-button"></div> {/* Google Sign-In Button will be rendered here */}
      <button className="signin-redirect-button" onClick={() => navigate('/signin')}>
        Already have an account? Sign In
      </button>
    </div>
  );
}

export default Signup;

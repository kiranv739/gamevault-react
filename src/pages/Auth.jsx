import React, { useState } from 'react';
import './auth.css';

function Auth({ error, onAuthSubmit, onGuestMode, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form States
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (onAuthSubmit) {
      onAuthSubmit(
        { email: loginEmail, password: loginPassword, rememberMe },
        'login'
      );
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (onAuthSubmit) {
      onAuthSubmit(
        { username: regUsername, email: regEmail, password: regPassword },
        'register'
      );
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card p-4">
        {/* Close Button */}
        <button onClick={onClose} className="auth-close-btn" aria-label="Close portal">
          <i className="bi bi-x-lg"></i>
        </button>

        {/* Tab Headers */}
        <div className="auth-tabs mb-4">
          <button 
            type="button" 
            onClick={() => setActiveTab('login')}
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          >
            Login
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('register')}
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          >
            Register
          </button>
        </div>

        {/* LOGIN TAB PANEL */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="fade-in">
            <div className="mb-3 text-start">
              <label className="auth-label mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="form-control auth-input"
              />
            </div>
            
            <div className="mb-3 text-start">
              <label className="auth-label mb-1">Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showLoginPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="form-control auth-input pe-5"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="password-toggle-eye"
                  aria-label="Toggle password visibility"
                >
                  <i className={`bi ${showLoginPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  id="remember_me" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-check-input auth-checkbox" 
                />
                <label htmlFor="remember_me" className="form-check-label remember-label">
                  Remember me
                </label>
              </div>
              <a href="#" className="forgot-password-link" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="w-100 btn-auth mb-3">
              Login
            </button>

            {error && <div className="text-danger text-center small mb-3">{error}</div>}

            <div className="divider-or mb-3">
              <span>or</span>
            </div>

            <button 
              type="button" 
              onClick={onGuestMode} 
              className="w-100 btn-guest"
            >
              Continue as Guest
            </button>
          </form>
        )}

        {/* REGISTER TAB PANEL */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="fade-in">
            <div className="mb-3 text-start">
              <label className="auth-label mb-1">Username</label>
              <input 
                type="text" 
                placeholder="Gamervault99"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
                className="form-control auth-input"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="auth-label mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                className="form-control auth-input"
              />
            </div>

            <div className="mb-3 text-start">
              <label className="auth-label mb-1">Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showRegPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  className="form-control auth-input pe-5"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="password-toggle-eye"
                  aria-label="Toggle password visibility"
                >
                  <i className={`bi ${showRegPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="mb-4 text-start">
              <label className="auth-label mb-1">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                required
                className="form-control auth-input"
              />
            </div>

            <button type="submit" className="w-100 btn-auth mb-3">
              Create Account
            </button>

            {error && <div className="text-danger text-center small mb-3">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

export default Auth;

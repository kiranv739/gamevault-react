import React, { useState } from 'react';
import './auth.css';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

function Login({ setAuthView }) {
  const login = useAuthStore((state) => state.login);
  const loginAsGuest = useAuthStore((state) => state.loginAsGuest);
  const authError = useAuthStore((state) => state.authError);
  const setAuthError = useAuthStore((state) => state.setAuthError);
  
  const showToast = useToastStore((state) => state.showToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login({ email, password, rememberMe }, showToast);
    setIsSubmitting(false);
  };

  const handleGuestClick = () => {
    loginAsGuest(showToast);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card p-4">
        <h2 className="text-center mb-4" style={{ color: 'var(--text)', fontWeight: 800 }}>GameVault</h2>
        
        {/* Navigation to Register */}
        <div className="auth-tabs mb-4">
          <button 
            type="button" 
            className="auth-tab-btn active"
            disabled
          >
            Login
          </button>
          <button 
            type="button" 
            onClick={() => {
              setAuthError('');
              setAuthView('register');
            }}
            className="auth-tab-btn"
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="fade-in">
          <div className="mb-3 text-start">
            <label className="auth-label mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control auth-input"
            />
          </div>
          
          <div className="mb-3 text-start">
            <label className="auth-label mb-1">Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control auth-input pe-5"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-eye"
                aria-label="Toggle password visibility"
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
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
            <button type="button" className="btn btn-link p-0 forgot-password-link" onClick={(e) => e.preventDefault()}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="w-100 btn-auth mb-3" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {authError && <div className="text-danger text-center small mb-3">{authError}</div>}

          <div className="divider-or mb-3">
            <span>or</span>
          </div>

          <button 
            type="button" 
            onClick={handleGuestClick} 
            className="w-100 btn-guest"
          >
            Continue as Guest
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

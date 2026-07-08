import React, { useState } from 'react';
import './auth.css';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

function Register({ setAuthView }) {
  const register = useAuthStore((state) => state.register);
  const authError = useAuthStore((state) => state.authError);
  const setAuthError = useAuthStore((state) => state.setAuthError);
  
  const showToast = useToastStore((state) => state.showToast);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsSubmitting(true);
    await register({ username, email, password }, showToast);
    setIsSubmitting(false);
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card p-4">
        <h2 className="text-center mb-4" style={{ color: 'var(--text)', fontWeight: 800 }}>GameVault</h2>
        
        {/* Navigation to Login */}
        <div className="auth-tabs mb-4">
          <button 
            type="button" 
            onClick={() => {
              setAuthError('');
              setAuthView('login');
            }}
            className="auth-tab-btn"
          >
            Login
          </button>
          <button 
            type="button" 
            className="auth-tab-btn active"
            disabled
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="fade-in">
          <div className="mb-3 text-start">
            <label className="auth-label mb-1">Username</label>
            <input 
              type="text" 
              placeholder="Gamervault99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control auth-input"
            />
          </div>

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

          <div className="mb-4 text-start">
            <label className="auth-label mb-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control auth-input"
            />
          </div>

          <button type="submit" className="w-100 btn-auth mb-3" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          {authError && <div className="text-danger text-center small mb-3">{authError}</div>}
        </form>
      </div>
    </div>
  );
}

export default Register;

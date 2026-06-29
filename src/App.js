import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import './App.css';
import Main from './pages/Main';
import useToast from './hooks/useToast';
import ToastContainer from './components/ToastContainer';
import Auth from './pages/Auth';

export const AppContext = React.createContext();

function App() {
  const [library, setLibrary] = useState([]);
  const [bag, setBag] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');
  
  const { toasts, showToast, dismissToast } = useToast();

  const handleAuthSubmit = (formData, mode) => {
    if (mode === 'login') {
      if (!formData.email || !formData.password) {
        setAuthError('Please fill in all fields');
        return;
      }
      // Simulate successful login
      const usernameFromEmail = formData.email.split('@')[0];
      setCurrentUser({
        username: usernameFromEmail,
        email: formData.email
      });
      setIsAuthenticated(true);
      setAuthError('');
      showToast(`Welcome back, ${usernameFromEmail}! 🎮`, 'success');
    } else {
      if (!formData.username || !formData.email || !formData.password) {
        setAuthError('Please fill in all fields');
        return;
      }
      // Simulate successful registration
      setCurrentUser({
        username: formData.username,
        email: formData.email
      });
      setIsAuthenticated(true);
      setAuthError('');
      showToast(`Account created! Welcome, ${formData.username}! 🚀`, 'success');
    }
  };

  const handleGuestMode = () => {
    setCurrentUser({
      username: 'Guest Gamer',
      email: 'guest@gamestore.local'
    });
    setIsAuthenticated(true);
    setAuthError('');
    showToast('Entered as Guest Gamer 🎮', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AppContext.Provider 
      value={{ 
        library, 
        setLibrary, 
        bag, 
        setBag, 
        showToast, 
        currentUser, 
        isAuthenticated, 
        logout: handleLogout 
      }}
    >
      <Main />
      
      {/* Auth overlay shown when not authenticated */}
      {!isAuthenticated && (
        <Auth 
          error={authError} 
          onAuthSubmit={handleAuthSubmit} 
          onGuestMode={handleGuestMode} 
          onClose={handleGuestMode} // close defaults to guest mode entry
        />
      )}

      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </AppContext.Provider>
  );
}

export default App;

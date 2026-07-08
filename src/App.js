import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import './App.css';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import ToastContainer from './components/ToastContainer';
import { useAuthStore } from './store/useAuthStore';
import { useToastStore } from './store/useToastStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [authView, setAuthView] = useState('login');

  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (isAuthenticated) {
    return (
      <>
        <Main />
        <ToastContainer toasts={toasts} dismissToast={dismissToast} />
      </>
    );
  }

  return (
    <>
      {authView === 'login' ? (
        <Login setAuthView={setAuthView} />
      ) : (
        <Register setAuthView={setAuthView} />
      )}
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </>
  );
}

export default App;

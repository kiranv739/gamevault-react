import React from 'react';
import Toast from './Toast';
import './toast.css';

function ToastContainer({ toasts, dismissToast }) {
  return (
    <div className="toast-container-wrapper">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={dismissToast}
        />
      ))}
    </div>
  );
}

export default ToastContainer;

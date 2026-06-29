import React from 'react';
import './toast.css';

function Toast({ id, message, type, onClose }) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill success-toast-icon';
      case 'error':
        return 'bi-x-circle-fill error-toast-icon';
      case 'info':
      default:
        return 'bi-info-circle-fill info-toast-icon';
    }
  };

  return (
    <div className={`custom-toast toast-${type}`} role="alert">
      <div className="toast-body-content">
        <i className={`bi ${getIcon()} toast-icon-prefix`}></i>
        <span className="toast-msg-text">{message}</span>
      </div>
      <button 
        onClick={() => onClose(id)} 
        className="toast-close-btn" 
        aria-label="Dismiss notification"
      >
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
}

export default Toast;

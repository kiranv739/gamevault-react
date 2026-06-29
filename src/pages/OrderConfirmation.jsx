import React, { useEffect, useState } from 'react';
import './orderConfirmation.css';

function OrderConfirmation({ reference, purchasedGames, onGoToLibrary, onContinueShopping }) {
  const [orderId, setOrderId] = useState('');

  // Generate 6-digit random order ID on mount
  useEffect(() => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    setOrderId(`#GS-${randomDigits}`);
  }, []);

  return (
    <section id="confirmation" className="confirmation" ref={reference}>
      <div className="container-fluid py-5 d-flex justify-content-center align-items-center min-vh-75">
        <div className="confirmation-card text-center p-5">
          {/* Success Checkmark */}
          <div className="success-icon-container mb-4">
            <i className="bi bi-check-circle-fill success-icon"></i>
          </div>

          <h1 className="confirmation-heading mb-2">Order Placed Successfully!</h1>
          <span className="order-id-label mb-4 d-block">Order ID: <strong>{orderId}</strong></span>

          {/* Purchased Games List */}
          {purchasedGames && purchasedGames.length > 0 && (
            <div className="purchased-games-summary mb-4">
              <h4 className="summary-title text-muted mb-3 text-start">Purchased Items</h4>
              <div className="summary-games-list">
                {purchasedGames.map((game) => (
                  <div key={game._id} className="summary-game-item d-flex align-items-center mb-2">
                    <img src={game.img} alt={game.title} className="summary-game-thumb" />
                    <span className="summary-game-title ms-3 text-start">{game.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="confirmation-actions d-flex justify-content-center gap-3 mt-4">
            <button onClick={onGoToLibrary} className="confirmation-btn btn-secondary-action">
              <i className="bi bi-heart-fill me-2"></i>Go to My Library
            </button>
            <button onClick={onContinueShopping} className="confirmation-btn btn-primary-action">
              <i className="bi bi-controller me-2"></i>Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmation;

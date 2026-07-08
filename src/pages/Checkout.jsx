import React, { useState } from 'react';
import './checkout.css';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';

function Checkout({ reference, onPlaceOrder }) {
  const bag = useCartStore((state) => state.bag);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const showToast = useToastStore((state) => state.showToast);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  
  // Card Details States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI State
  const [upiId, setUpiId] = useState('');

  // Wallet State
  const [wallet, setWallet] = useState('Paytm');

  const subtotal = bag.reduce((acc, game) => acc + game.price, 0);
  const total = bag.reduce((acc, game) => acc + (game.price * (1 - game.discount)), 0);
  const discountSaved = subtotal - total;

  const handleRemoveItem = (id) => {
    removeFromCart(id, showToast);
  };

  const handleCardNumberChange = (e) => {
    // Mask and format 16-digit card number with spaces (e.g. XXXX XXXX XXXX XXXX)
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formattedValue.substring(0, 19)); // 16 digits + 3 spaces
  };

  const handleExpiryChange = (e) => {
    // Format expiry as MM/YY
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setExpiry(formatted.substring(0, 5));
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvv(value.substring(0, 3));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (bag.length === 0) {
      alert('Your cart is empty. Cannot place order.');
      return;
    }
    if (onPlaceOrder) {
      onPlaceOrder();
    }
  };

  return (
    <section id="checkout" className="checkout" ref={reference}>
      <div className="container-fluid py-4">
        <h1 className="sectionTitle mb-4">Checkout</h1>
        
        {bag.length === 0 ? (
          <div className="text-center py-5">
            <h2 className="text-muted">Your bag is empty. Please add games to checkout.</h2>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="row g-5">
              {/* LEFT COLUMN: Order Summary */}
              <div className="col-lg-6">
                <div className="checkout-card p-4">
                  <h3 className="card-title mb-4"><i className="bi bi-receipt me-2"></i>Order Summary</h3>
                  
                  <div className="order-items-list mb-4">
                    {bag.map((game) => (
                      <div key={game._id} className="order-item-row d-flex align-items-center mb-3">
                        <img src={game.img} alt={game.title} className="order-item-thumb" />
                        <div className="order-item-info flex-grow-1 ms-3">
                          <h5 className="item-title mb-0">{game.title}</h5>
                          <span className="item-price">
                            ₹{((1 - game.discount) * game.price).toFixed(2)}
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(game._id)}
                          className="remove-item-btn"
                          aria-label="Remove item"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="divider-line mb-3"></div>

                  <div className="price-summary-details">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="summary-label">Subtotal</span>
                      <span className="summary-value">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 text-danger">
                      <span className="summary-label">Discount Saved</span>
                      <span className="summary-value">-₹{discountSaved.toFixed(2)}</span>
                    </div>
                    <div className="divider-line my-3"></div>
                    <div className="d-flex justify-content-between align-items-center total-row">
                      <span className="total-label">Total Payment</span>
                      <span className="total-value">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Payment Details */}
              <div className="col-lg-6">
                <div className="checkout-card p-4">
                  <h3 className="card-title mb-4"><i className="bi bi-wallet2 me-2"></i>Payment Details</h3>
                  
                  <label className="input-label mb-2">Payment Method</label>
                  <div className="payment-options-grid mb-4">
                    {/* Card Option */}
                    <div 
                      className={`payment-option-card ${paymentMethod === 'Card' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('Card')}
                    >
                      <input 
                        type="radio" 
                        name="payment_type" 
                        checked={paymentMethod === 'Card'} 
                        onChange={() => setPaymentMethod('Card')}
                        id="pay_card"
                        className="payment-radio"
                      />
                      <label htmlFor="pay_card" className="payment-label">
                        <i className="bi bi-credit-card-2-front me-2"></i>
                        Card
                      </label>
                    </div>

                    {/* UPI Option */}
                    <div 
                      className={`payment-option-card ${paymentMethod === 'UPI' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('UPI')}
                    >
                      <input 
                        type="radio" 
                        name="payment_type" 
                        checked={paymentMethod === 'UPI'} 
                        onChange={() => setPaymentMethod('UPI')}
                        id="pay_upi"
                        className="payment-radio"
                      />
                      <label htmlFor="pay_upi" className="payment-label">
                        <i className="bi bi-phone me-2"></i>
                        UPI
                      </label>
                    </div>

                    {/* Wallet Option */}
                    <div 
                      className={`payment-option-card ${paymentMethod === 'Wallet' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('Wallet')}
                    >
                      <input 
                        type="radio" 
                        name="payment_type" 
                        checked={paymentMethod === 'Wallet'} 
                        onChange={() => setPaymentMethod('Wallet')}
                        id="pay_wallet"
                        className="payment-radio"
                      />
                      <label htmlFor="pay_wallet" className="payment-label">
                        <i className="bi bi-wallet me-2"></i>
                        Wallet
                      </label>
                    </div>
                  </div>

                  {/* Payment Inputs Area */}
                  <div className="payment-inputs-container mb-4">
                    {paymentMethod === 'Card' && (
                      <div className="card-inputs-panel fade-in">
                        <div className="mb-3">
                          <label className="form-label text-muted">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="XXXX XXXX XXXX XXXX"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            required={paymentMethod === 'Card'}
                            className="form-control checkout-input"
                            pattern="\d{4}\s\d{4}\s\d{4}\s\d{4}"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label text-muted">Name on Card</label>
                          <input 
                            type="text" 
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required={paymentMethod === 'Card'}
                            className="form-control checkout-input"
                          />
                        </div>
                        <div className="row">
                          <div className="col-6 mb-3">
                            <label className="form-label text-muted">Expiry (MM/YY)</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={handleExpiryChange}
                              required={paymentMethod === 'Card'}
                              className="form-control checkout-input"
                              pattern="(0[1-9]|1[0-2])\/\d{2}"
                            />
                          </div>
                          <div className="col-6 mb-3">
                            <label className="form-label text-muted">CVV</label>
                            <input 
                              type="password" 
                              placeholder="123"
                              value={cvv}
                              onChange={handleCvvChange}
                              required={paymentMethod === 'Card'}
                              className="form-control checkout-input"
                              pattern="\d{3}"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'UPI' && (
                      <div className="upi-inputs-panel fade-in">
                        <div className="mb-3">
                          <label className="form-label text-muted">UPI ID</label>
                          <input 
                            type="text" 
                            placeholder="username@okaxis"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            required={paymentMethod === 'UPI'}
                            className="form-control checkout-input"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'Wallet' && (
                      <div className="wallet-inputs-panel fade-in">
                        <div className="mb-3">
                          <label className="form-label text-muted">Select Wallet</label>
                          <select 
                            value={wallet} 
                            onChange={(e) => setWallet(e.target.value)}
                            className="form-select checkout-input"
                          >
                            <option value="Paytm">Paytm</option>
                            <option value="PhonePe">PhonePe</option>
                            <option value="Amazon Pay">Amazon Pay</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="w-100 btn-place-order py-3">
                    <i className="bi bi-shield-check me-2"></i>Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default Checkout;

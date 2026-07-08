import React, { useState } from 'react';
import './profile.css';
import { useLibraryStore } from '../store/useLibraryStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

function Profile({ reference, onNavigate }) {
  const library = useLibraryStore((state) => state.library);
  const bag = useCartStore((state) => state.bag);
  const user = useAuthStore((state) => state.user);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Dummy states for password form inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Local state for orders count
  const [ordersCount] = useState(1);

  const initial = user?.username 
    ? user.username.charAt(0).toUpperCase() 
    : 'G';

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    alert('Password updated successfully! (Mock Action)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordExpanded(false);
  };

  return (
    <section id="profile" className="profile" ref={reference}>
      <div className="container-fluid py-4">
        <h1 className="sectionTitle mb-4">My Profile</h1>

        {/* 1. PROFILE HEADER */}
        <div className="profile-card mb-4 p-4">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            <div className="profile-avatar-circle">
              {initial}
            </div>
            <div className="profile-meta text-center text-md-start flex-grow-1">
              <h3 className="profile-username mb-1 text-capitalize">{user?.username || 'Guest Gamer'}</h3>
              {user?.email && <p className="profile-email text-muted mb-3">{user.email}</p>}
              <button className="btn-edit-profile py-2 px-4" type="button">
                <i className="bi bi-pencil-square me-2"></i>Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* 2. STATS ROW */}
        <div className="row g-4 mb-4">
          {/* Stats Card 1 */}
          <div className="col-md-4">
            <div className="stats-card p-4 text-center">
              <i className="bi bi-controller stats-icon mb-2"></i>
              <h4 className="stats-value">{library.length}</h4>
              <span className="stats-label">Games in Library</span>
            </div>
          </div>

          {/* Stats Card 2 */}
          <div className="col-md-4">
            <div className="stats-card p-4 text-center">
              <i className="bi bi-bag-heart stats-icon mb-2"></i>
              <h4 className="stats-value">{bag.length}</h4>
              <span className="stats-label">Items in Cart</span>
            </div>
          </div>

          {/* Stats Card 3 */}
          <div className="col-md-4">
            <div className="stats-card p-4 text-center">
              <i className="bi bi-credit-card-2-back stats-icon mb-2"></i>
              <h4 className="stats-value">{ordersCount}</h4>
              <span className="stats-label">Orders Placed</span>
            </div>
          </div>
        </div>

        {/* 3. MY ORDERS SECTION */}
        <div className="profile-card mb-4 p-4">
          <h3 className="card-title mb-4"><i className="bi bi-box-seam me-2"></i>My Orders</h3>
          
          {ordersCount === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-3">No orders yet. Start shopping!</p>
              <button 
                onClick={() => onNavigate?.('home')} 
                className="empty-state-btn"
                type="button"
              >
                Browse Games
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-borderless align-middle profile-orders-table">
                <thead>
                  <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Games</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="order-id-badge">#GV-738492</span></td>
                    <td>June 29, 2026</td>
                    <td className="text-muted">Cyberpunk 2077, Elden Ring</td>
                    <td>₹3,499.00</td>
                    <td><span className="badge status-badge bg-success">Delivered</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. ACCOUNT SETTINGS */}
        <div className="profile-card p-4">
          <h3 className="card-title mb-4"><i className="bi bi-gear me-2"></i>Account Settings</h3>
          
          {/* Change Password Dropdown */}
          <div className="settings-item mb-4">
            <button 
              onClick={() => setIsPasswordExpanded(!isPasswordExpanded)}
              className="settings-collapse-header w-100 d-flex justify-content-between align-items-center py-2"
              type="button"
            >
              <span className="settings-item-title"><i className="bi bi-shield-lock me-2"></i>Change Password</span>
              <i className={`bi ${isPasswordExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            </button>
            
            {isPasswordExpanded && (
              <form onSubmit={handlePasswordSubmit} className="mt-3 password-form fade-in">
                <div className="mb-3">
                  <label className="auth-label mb-1">Current Password</label>
                  <input 
                    type="password" 
                    required 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="form-control auth-input"
                    placeholder="••••••••"
                  />
                </div>
                <div className="mb-3">
                  <label className="auth-label mb-1">New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-control auth-input"
                    placeholder="••••••••"
                  />
                </div>
                <div className="mb-3">
                  <label className="auth-label mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control auth-input"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn-auth py-2 px-4 mt-2">
                  Update Password
                </button>
              </form>
            )}
          </div>

          <div className="divider-line my-3"></div>

          {/* Notification Preferences */}
          <div className="settings-item mb-4">
            <h5 className="settings-sub-title mb-3"><i className="bi bi-bell me-2"></i>Notification Preferences</h5>
            <div className="d-flex flex-column gap-3">
              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                <label className="form-check-label remember-label" htmlFor="emailNotif">
                  Email notifications
                </label>
                <input 
                  className="form-check-input auth-checkbox ms-0" 
                  type="checkbox" 
                  id="emailNotif" 
                  defaultChecked 
                />
              </div>
              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                <label className="form-check-label remember-label" htmlFor="releaseNotif">
                  New release alerts
                </label>
                <input 
                  className="form-check-input auth-checkbox ms-0" 
                  type="checkbox" 
                  id="releaseNotif" 
                  defaultChecked 
                />
              </div>
            </div>
          </div>

          <div className="divider-line my-3"></div>

          {/* Delete Account */}
          <div className="settings-item">
            <h5 className="settings-sub-title text-danger mb-2">Danger Zone</h5>
            <p className="text-muted small mb-3">Deleting your account is permanent. All wishlists, cart data, and purchase history will be lost.</p>
            <button 
              onClick={() => setShowDeleteModal(true)} 
              className="btn-delete-account py-2 px-4"
              type="button"
            >
              <i className="bi bi-exclamation-triangle me-2"></i>Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal overlay */}
      {showDeleteModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-card p-4 text-center">
            <i className="bi bi-exclamation-octagon-fill text-danger modal-warning-icon mb-3"></i>
            <h3 className="modal-title mb-2">Delete Account</h3>
            <p className="text-muted mb-4">
              Are you sure you want to delete your account? This action is permanent and cannot be undone.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="btn-modal-cancel py-2 px-4"
                type="button"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('Account deletion simulated! (Mock Action)');
                  setShowDeleteModal(false);
                }} 
                className="btn-modal-delete py-2 px-4"
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Profile;

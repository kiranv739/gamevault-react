import React, { useState } from 'react';
import './profile.css';
import { useLibraryStore } from '../store/useLibraryStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

function Profile({ reference }) {
  const purchasedGames = useLibraryStore((state) => state.purchasedGames) || [];
  const bag = useCartStore((state) => state.bag) || [];
  const user = useAuthStore((state) => state.user);
  const isGuest = useAuthStore((state) => state.isGuest);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const changePassword = useAuthStore((state) => state.changePassword);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const showToast = useToastStore((state) => state.showToast);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'G';
  const errorMessage = (error) => error.response?.data?.detail || error.message || 'Something went wrong';

  const openProfileEditor = () => {
    setProfileForm({ username: user?.username || '', email: user?.email || '' });
    setIsEditingProfile(true);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateProfile(profileForm);
      showToast('Profile updated successfully', 'success');
      setIsEditingProfile(false);
    } catch (error) {
      showToast(errorMessage(error), 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('The new passwords do not match', 'warning');
      return;
    }
    setIsSavingPassword(true);
    try {
      await changePassword({ current_password: currentPassword, new_password: newPassword });
      showToast('Password updated successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordExpanded(false);
    } catch (error) {
      showToast(errorMessage(error), 'error');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    setIsDeletingAccount(true);
    try {
      await deleteAccount(deletePassword, showToast);
    } catch (error) {
      showToast(errorMessage(error), 'error');
      setIsDeletingAccount(false);
    }
  };

  return (
    <section id="profile" className="profile" ref={reference}>
      <div className="container-fluid py-4">
        <h1 className="sectionTitle mb-4">My Profile</h1>

        <div className="profile-card mb-4 p-4">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            <div className="profile-avatar-circle">{initial}</div>
            <div className="profile-meta text-center text-md-start flex-grow-1">
              <h3 className="profile-username mb-1 text-capitalize">{user?.username || 'Guest Gamer'}</h3>
              {user?.email && <p className="profile-email text-muted mb-3">{user.email}</p>}
              {!isGuest && user && (
                <button
                  className="btn-edit-profile py-2 px-4"
                  type="button"
                  onClick={isEditingProfile ? () => setIsEditingProfile(false) : openProfileEditor}
                >
                  <i className={`bi ${isEditingProfile ? 'bi-x-lg' : 'bi-pencil-square'} me-2`}></i>
                  {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              )}
            </div>
          </div>
        </div>

        {isEditingProfile && (
          <form className="profile-card profile-edit-form mb-4 p-4" onSubmit={handleProfileSubmit}>
            <h3 className="card-title mb-4">Edit Profile</h3>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="auth-label mb-1" htmlFor="profile-username">Username</label>
                <input
                  id="profile-username"
                  className="form-control auth-input"
                  value={profileForm.username}
                  onChange={(event) => setProfileForm({ ...profileForm, username: event.target.value })}
                  maxLength={80}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="auth-label mb-1" htmlFor="profile-email">Email address</label>
                <input
                  id="profile-email"
                  className="form-control auth-input"
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-auth py-2 px-4 mt-4" disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        )}

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="stats-card p-4 text-center">
              <i className="bi bi-controller stats-icon mb-2"></i>
              <h4 className="stats-value">{purchasedGames.length}</h4>
              <span className="stats-label">Games in Library</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="stats-card p-4 text-center">
              <i className="bi bi-bag-heart stats-icon mb-2"></i>
              <h4 className="stats-value">{bag.length}</h4>
              <span className="stats-label">Items in Cart</span>
            </div>
          </div>
        </div>

        <div className="profile-card p-4">
          <h3 className="card-title mb-4"><i className="bi bi-gear me-2"></i>Account Settings</h3>

          {!isGuest && user && (
            <>
              <div className="settings-item mb-4">
                <button
                  onClick={() => setIsPasswordExpanded(!isPasswordExpanded)}
                  className="settings-collapse-header w-100 d-flex justify-content-between align-items-center py-2"
                  type="button"
                  aria-expanded={isPasswordExpanded}
                >
                  <span className="settings-item-title"><i className="bi bi-shield-lock me-2"></i>Change Password</span>
                  <i className={`bi ${isPasswordExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </button>

                {isPasswordExpanded && (
                  <form onSubmit={handlePasswordSubmit} className="mt-3 password-form fade-in">
                    <div className="mb-3">
                      <label className="auth-label mb-1" htmlFor="current-password">Current Password</label>
                      <input id="current-password" type="password" required value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        className="form-control auth-input" autoComplete="current-password" />
                    </div>
                    <div className="mb-3">
                      <label className="auth-label mb-1" htmlFor="new-password">New Password</label>
                      <input id="new-password" type="password" required minLength={8} value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="form-control auth-input" autoComplete="new-password" />
                    </div>
                    <div className="mb-3">
                      <label className="auth-label mb-1" htmlFor="confirm-password">Confirm New Password</label>
                      <input id="confirm-password" type="password" required minLength={8} value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        className="form-control auth-input" autoComplete="new-password" />
                    </div>
                    <button type="submit" className="btn-auth py-2 px-4 mt-2" disabled={isSavingPassword}>
                      {isSavingPassword ? 'Updating…' : 'Update Password'}
                    </button>
                  </form>
                )}
              </div>

              <div className="divider-line my-3"></div>
            </>
          )}

          <div className="settings-item mb-4">
            <h5 className="settings-sub-title mb-3"><i className="bi bi-bell me-2"></i>Notification Preferences</h5>
            <div className="d-flex flex-column gap-3">
              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                <label className="form-check-label remember-label" htmlFor="emailNotif">Email notifications</label>
                <input className="form-check-input auth-checkbox ms-0" type="checkbox" id="emailNotif" defaultChecked />
              </div>
              <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                <label className="form-check-label remember-label" htmlFor="releaseNotif">New release alerts</label>
                <input className="form-check-input auth-checkbox ms-0" type="checkbox" id="releaseNotif" defaultChecked />
              </div>
            </div>
          </div>

          {!isGuest && user && (
            <>
              <div className="divider-line my-3"></div>
              <div className="settings-item">
                <h5 className="settings-sub-title text-danger mb-2">Danger Zone</h5>
                <p className="text-muted small mb-3">Deleting your account permanently removes your profile, library, and cart.</p>
                <button onClick={() => setShowDeleteModal(true)} className="btn-delete-account py-2 px-4" type="button">
                  <i className="bi bi-exclamation-triangle me-2"></i>Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="profile-modal-overlay">
          <form className="profile-modal-card p-4" onSubmit={handleDeleteAccount}>
            <div className="text-center">
              <i className="bi bi-exclamation-octagon-fill text-danger modal-warning-icon mb-3"></i>
              <h3 className="modal-title mb-2">Delete Account</h3>
              <p className="text-muted mb-4">This permanently deletes your account, library, and cart. Enter your password to confirm.</p>
            </div>
            <label className="auth-label mb-1" htmlFor="delete-password">Current Password</label>
            <input
              id="delete-password"
              type="password"
              className="form-control auth-input mb-4"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
              autoComplete="current-password"
              required
            />
            <div className="d-flex gap-3 justify-content-center">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
                className="btn-modal-cancel py-2 px-4"
                type="button"
                disabled={isDeletingAccount}
              >Cancel</button>
              <button className="btn-modal-delete py-2 px-4" type="submit" disabled={isDeletingAccount}>
                {isDeletingAccount ? 'Deleting…' : 'Delete Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default Profile;

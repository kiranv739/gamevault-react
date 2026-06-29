import React, { useState, useEffect, useContext } from 'react';
import './header.css';
import { AppContext } from '../App';
import monke from '../images/monke.jpg';

function Header({ toggleActive, onSearch, onProfile, onOrders, onLogout, searchQuery, onWishlistClick, onCartClick }) {
  const { library, bag, currentUser } = useContext(AppContext);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearchQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearchQuery);
    }
    setIsMobileSearchExpanded(false);
  };

  return (
    <header className="main-header">
      {/* Left side: Menu Toggle */}
      <div className="header-left">
        <a href="#" className="menu-btn" onClick={toggleActive} aria-label="Toggle menu">
          <i className="bi bi-sliders"></i>
        </a>
      </div>

      {/* Center: Search Bar (Responsive) */}
      <div className={`header-center ${isMobileSearchExpanded ? 'expanded' : ''}`}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search games..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-submit-btn" aria-label="Search">
            <i className="bi bi-search"></i>
          </button>
        </form>
      </div>

      {/* Right: Actions and User Menu */}
      <div className="header-right">
        {/* Mobile Search Toggle */}
        <button
          className="mobile-search-toggle d-lg-none"
          onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}
          aria-label="Toggle search"
        >
          <i className={`bi ${isMobileSearchExpanded ? 'bi-x-lg' : 'bi-search'}`}></i>
        </button>

        {/* Wishlist */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onWishlistClick?.(); }}
          className="header-action-icon" 
          aria-label="Wishlist"
        >
          <i className="bi bi-heart-fill"></i>
          {library && library.length > 0 && (
            <span className="count-badge">{library.length}</span>
          )}
        </a>

        {/* Cart */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onCartClick?.(); }}
          className="header-action-icon" 
          aria-label="Cart"
        >
          <i className="bi bi-bag-fill"></i>
          {bag && bag.length > 0 && (
            <span className="count-badge">{bag.length}</span>
          )}
        </a>

        {/* User Dropdown */}
        <div className="user-dropdown-wrapper d-flex align-items-center gap-2">
          {currentUser && (
            <span className="header-username d-none d-md-inline text-capitalize" style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text)' }}>
              {currentUser.username}
            </span>
          )}
          <button
            className="avatar-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="User profile menu"
          >
            <img src={monke} alt="User Avatar" className="avatar-img" />
          </button>

          {isDropdownOpen && (
            <>
              {/* Overlay background to dismiss menu clicking outside */}
              <div className="dropdown-overlay" onClick={() => setIsDropdownOpen(false)}></div>
              <div className="header-dropdown-menu">
                <button
                  className="dropdown-item-link"
                  onClick={() => {
                    onProfile?.();
                    setIsDropdownOpen(false);
                  }}
                >
                  <i className="bi bi-person-fill item-icon"></i>
                  <span>My Profile</span>
                </button>
                <button
                  className="dropdown-item-link"
                  onClick={() => {
                    onOrders?.();
                    setIsDropdownOpen(false);
                  }}
                >
                  <i className="bi bi-receipt-cutoff item-icon"></i>
                  <span>My Orders</span>
                </button>
                <div className="dropdown-divider-line"></div>
                <button
                  className="dropdown-item-link logout-item"
                  onClick={() => {
                    onLogout?.();
                    setIsDropdownOpen(false);
                  }}
                >
                  <i className="bi bi-box-arrow-right item-icon"></i>
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
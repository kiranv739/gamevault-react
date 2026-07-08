import React, { useState, useEffect } from 'react';
import './gameDetail.css';
import { useLibraryStore } from '../store/useLibraryStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import GameRating from '../components/GameRating';
import GameCard from '../components/GameCard';

function GameDetail({ game, games, onClose }) {
  const library = useLibraryStore((state) => state.library);
  const addToLibrary = useLibraryStore((state) => state.addToLibrary);
  const removeFromLibrary = useLibraryStore((state) => state.removeFromLibrary);

  const bag = useCartStore((state) => state.bag);
  const addToCart = useCartStore((state) => state.addToCart);

  const showToast = useToastStore((state) => state.showToast);
  const [activeTab, setActiveTab] = useState('About');

  // Escape key handler to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!game) return null;

  const isInLibrary = library.some((item) => item._id === game._id);
  const isInBag = bag.some((item) => item._id === game._id);

  const toggleLibrary = (e) => {
    e.stopPropagation();
    if (isInLibrary) {
      removeFromLibrary(game._id, showToast);
    } else {
      addToLibrary(game, showToast);
    }
  };

  const handleAddToBag = (e) => {
    e.stopPropagation();
    addToCart(game, showToast);
  };

  // Dummy screenshot array
  const screenshots = [game.img, game.img, game.img];

  // Placeholder games for Similar Games tab (exclude current game)
  const similarGames = games.filter((g) => g._id !== game._id).slice(0, 4);

  return (
    <div className="game-detail-overlay">
      {/* 1. TOP BAR */}
      <div className="detail-top-bar">
        <button onClick={onClose} className="back-btn" aria-label="Go back">
          <i className="bi bi-arrow-left"></i>
        </button>
        <span className="detail-header-title">{game.title}</span>
        <button 
          onClick={toggleLibrary} 
          className={`wishlist-toggle-btn ${isInLibrary ? 'active' : ''}`}
          aria-label="Toggle wishlist"
        >
          <i className={`bi ${isInLibrary ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
      </div>

      <div className="container detail-content-wrapper py-5">
        {/* 2. HERO SECTION */}
        <div className="row g-5">
          {/* LEFT COLUMN: Media */}
          <div className="col-lg-6">
            <div className="main-image-container">
              <img src={game.img} alt={game.title} className="detail-main-img" />
            </div>
            <div className="screenshots-row mt-3">
              {screenshots.map((src, index) => (
                <div key={index} className="screenshot-thumb-container">
                  <img src={src} alt="screenshot" className="screenshot-thumb" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Actions */}
          <div className="col-lg-6 d-flex flex-column justify-content-between">
            <div className="game-info-block">
              <span className="badge genre-badge mb-3">{game.category}</span>
              <h2 className="game-detail-title mb-2">{game.title}</h2>
              <div className="mb-4">
                <GameRating rating={game.rating} />
              </div>

              {/* Price section */}
              <div className="price-block mb-4">
                {game.discount > 0 ? (
                  <div className="d-flex align-items-center gap-3">
                    <span className="prev-price">₹{game.price.toFixed(2)}</span>
                    <span className="discount-tag">-{game.discount * 100}%</span>
                    <span className="current-price">
                      ₹{((1 - game.discount) * game.price).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="current-price">₹{game.price.toFixed(2)}</span>
                )}
              </div>

              <p className="short-desc-text mb-4">
                {game.description || "Enter an immersive, action-packed world in this top-tier gaming adventure built for next-generation systems."}
              </p>
            </div>

            <div className="game-actions-block">
              <button 
                onClick={handleAddToBag} 
                className={`w-100 btn-cart mb-3 ${isInBag ? 'in-bag' : ''}`}
                disabled={isInBag}
              >
                <i className={`bi ${isInBag ? 'bi-bag-check-fill' : 'bi-bag-plus-fill'} me-2`}></i>
                {isInBag ? 'Added to Bag' : 'Add to Cart'}
              </button>
              <button 
                onClick={toggleLibrary} 
                className="w-100 btn-wishlist"
              >
                <i className={`bi ${isInLibrary ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                {isInLibrary ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. DETAILS SECTION */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="detail-tabs-nav mb-4">
              {['About', 'System Requirements', 'Similar Games'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-nav-btn ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="tab-content-container">
              {/* About Tab */}
              {activeTab === 'About' && (
                <div className="about-tab-panel">
                  <p className="description-paragraph">
                    {game.description || "No full description available for this game yet."}
                  </p>
                </div>
              )}

              {/* System Requirements Tab */}
              {activeTab === 'System Requirements' && (
                <div className="reqs-tab-panel table-responsive">
                  <table className="table system-reqs-table">
                    <thead>
                      <tr>
                        <th>Spec</th>
                        <th>Minimum Requirements</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>OS</strong></td>
                        <td>Windows 10/11 (64-bit)</td>
                      </tr>
                      <tr>
                        <td><strong>Processor</strong></td>
                        <td>Intel Core i5-8400 | AMD Ryzen 5 2600</td>
                      </tr>
                      <tr>
                        <td><strong>Memory</strong></td>
                        <td>12 GB RAM</td>
                      </tr>
                      <tr>
                        <td><strong>Graphics</strong></td>
                        <td>NVIDIA GeForce GTX 1060 (6GB) | AMD Radeon RX 580 (8GB)</td>
                      </tr>
                      <tr>
                        <td><strong>Storage</strong></td>
                        <td>70 GB available space (SSD recommended)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Similar Games Tab */}
              {activeTab === 'Similar Games' && (
                <div className="similar-tab-panel">
                  <div className="similar-games-scroller">
                    {similarGames.length > 0 ? (
                      similarGames.map((g) => (
                        <GameCard key={`similar-${g._id}`} game={g} />
                      ))
                    ) : (
                      <p className="text-muted">No similar games found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetail;

import React, { useState, useEffect } from 'react';
import './gameDetail.css';
import { useLibraryStore } from '../store/useLibraryStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import GameRating from '../components/GameRating';
import GameCard from '../components/GameCard';
import { getSimilarGames } from '../api/similar';
import SkeletonCard from '../components/SkeletonCard';

function GameDetail({ game, games, onClose }) {
  const library = useLibraryStore((state) => state.library);
  const addToLibrary = useLibraryStore((state) => state.addToLibrary);
  const removeFromLibrary = useLibraryStore((state) => state.removeFromLibrary);

  const bag = useCartStore((state) => state.bag);
  const addToCart = useCartStore((state) => state.addToCart);

  const showToast = useToastStore((state) => state.showToast);
  const [activeTab, setActiveTab] = useState('About');
  const [similarGames, setSimilarGames] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [similarError, setSimilarError] = useState(false);

  useEffect(() => {
    if (activeTab === 'Similar Games' && game) {
      const fetchSimilar = async () => {
        setLoadingSimilar(true);
        setSimilarError(false);
        try {
          const data = await getSimilarGames(game._id);
          setSimilarGames(data);
        } catch (err) {
          console.error('Error fetching similar games:', err);
          setSimilarError(true);
        } finally {
          setLoadingSimilar(false);
        }
      };
      fetchSimilar();
    }
  }, [activeTab, game]);

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
                  
                  {/* Game Details Info Grid */}
                  <div className="game-info-grid mt-4 p-3 rounded" style={{ background: 'rgba(20, 20, 53, 0.3)', border: '1px solid rgba(217, 70, 239, 0.12)' }}>
                    <div className="row text-center text-md-start">
                      <div className="col-6 col-md-3 mb-2 mb-md-0">
                        <span className="text-muted small d-block">Publisher</span>
                        <strong className="text-white small">{game.publisher || 'N/A'}</strong>
                      </div>
                      <div className="col-6 col-md-3 mb-2 mb-md-0">
                        <span className="text-muted small d-block">Developer</span>
                        <strong className="text-white small">{game.developer || 'N/A'}</strong>
                      </div>
                      <div className="col-6 col-md-3">
                        <span className="text-muted small d-block">Released</span>
                        <strong className="text-white small">{game.release_date || 'N/A'}</strong>
                      </div>
                      <div className="col-6 col-md-3">
                        <span className="text-muted small d-block">Rating</span>
                        <strong className="text-white small">{game.esrb_rating || 'N/A'}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Requirements Tab */}
              {activeTab === 'System Requirements' && (
                <div className="reqs-tab-panel">
                  {game.min_requirements || game.recommended_requirements ? (
                    <div className="row g-4">
                      {game.min_requirements && (
                        <div className="col-12 col-md-6">
                          <div className="p-3 rounded" style={{ background: 'rgba(20, 20, 53, 0.25)', border: '1px solid rgba(217, 70, 239, 0.12)', height: '100%' }}>
                            <h5 className="text-glow mb-3"><i className="bi bi-cpu me-2"></i>Minimum</h5>
                            <div className="small" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#e0e0e0' }}>
                              {game.min_requirements}
                            </div>
                          </div>
                        </div>
                      )}
                      {game.recommended_requirements && (
                        <div className="col-12 col-md-6">
                          <div className="p-3 rounded" style={{ background: 'rgba(20, 20, 53, 0.25)', border: '1px solid rgba(217, 70, 239, 0.12)', height: '100%' }}>
                            <h5 className="text-glow mb-3"><i className="bi bi-speedometer2 me-2"></i>Recommended</h5>
                            <div className="small" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#e0e0e0' }}>
                              {game.recommended_requirements}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">Requirements not available for this game</p>
                    </div>
                  )}
                </div>
              )}

              {/* Similar Games Tab */}
              {activeTab === 'Similar Games' && (
                <div className="similar-tab-panel">
                  <div className="similar-games-scroller">
                    {loadingSimilar ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonCard key={`skeleton-${index}`} />
                      ))
                    ) : similarError || similarGames.length === 0 ? (
                      <p className="text-muted">No similar games found.</p>
                    ) : (
                      similarGames.map((g) => (
                        <GameCard key={`similar-${g._id}`} game={g} />
                      ))
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

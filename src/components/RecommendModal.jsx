import React, { useState, useEffect, useCallback } from 'react';
import { getRecommendations } from '../api/recommend';
import './recommendModal.css';

function RecommendModal({ isOpen, onClose, libraryGames, onSearchGame }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!libraryGames || libraryGames.length < 2) return;
    setLoading(true);
    setError(false);
    try {
      const gameIds = libraryGames.slice(0, 5).map((game) => game._id);
      const data = await getRecommendations(gameIds);
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [libraryGames]);

  useEffect(() => {
    if (isOpen) {
      fetchRecommendations();
    }
  }, [isOpen, fetchRecommendations]);

  // Escape key handler to close the modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSearchClick = (title) => {
    onSearchGame?.(title);
    onClose();
  };

  return (
    <div className="recommend-modal-overlay" onClick={onClose}>
      <div 
        className="recommend-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="recommend-modal-header d-flex justify-content-between align-items-center">
          <h5 className="modal-title">AI Game Recommendations</h5>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            aria-label="Close" 
            onClick={onClose}
          ></button>
        </div>

        <div className="recommend-modal-body">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="spinner-border text-glow mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted text-center animate-pulse">Analyzing your gaming taste and crafting recommendations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <i className="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3"></i>
              <p className="text-white fw-bold">Could not load recommendations, try again</p>
              <button 
                type="button" 
                className="empty-state-btn mt-2" 
                onClick={fetchRecommendations}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="recommendation-list">
              <p className="text-muted small mb-4 text-center">Based on the games in your wishlist, our AI thinks you would love these:</p>
              {recommendations.map((game, index) => (
                <div key={index} className="recommendation-card mb-3 p-3 animate-fade-in">
                  <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap flex-sm-nowrap">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <h6 className="game-title mb-0 fw-bold">{game.title}</h6>
                        <span className="badge bg-primary genre-badge">{game.genre}</span>
                      </div>
                      <p className="reason-text text-muted mb-0 small italic">
                        <i className="bi bi-quote me-1"></i>
                        {game.reason}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="search-game-btn mt-2 mt-sm-0"
                      onClick={() => handleSearchClick(game.title)}
                    >
                      <i className="bi bi-search me-1"></i> Search Game
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecommendModal;

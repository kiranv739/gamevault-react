import React, { useState } from 'react';
import './mylibrary.css';
import GameCard from '../components/GameCard';
import RecommendModal from '../components/RecommendModal';
import { useAuthStore } from '../store/useAuthStore';

function MyLibrary({ games, reference, onGameClick, onSectionSwitch, onSearchGame }) {
  const isGuest = useAuthStore((state) => state.isGuest);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasEnoughGames = games.length >= 2;

  return (
    <section id="wishlist" className="wishlist" ref={reference}>
      <div className="container-fluid">
        <div className="row mb-3 align-items-center">
          <div className="col-12 col-md-6">
            <h1>My Wishlist</h1>
          </div>
          <div className="col-12 col-md-6 text-md-end mt-2 mt-md-0">
            {isGuest ? (
              <span className="text-muted small italic">
                <i className="bi bi-info-circle me-1"></i>
                Login to get personalized recommendations
              </span>
            ) : (
              <span 
                className="d-inline-block" 
                title={!hasEnoughGames ? "Add at least 2 games to get recommendations" : ""}
              >
                <button
                  type="button"
                  className="empty-state-btn py-2 px-4"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => setIsModalOpen(true)}
                  disabled={!hasEnoughGames}
                >
                  <i className="bi bi-cpu me-2"></i> Get Recommendations
                </button>
              </span>
            )}
          </div>
        </div>
        <div className="row">
          {games.length === 0 ? (
            <div className="col-12">
              <div className="empty-state-container py-5 text-center">
                <i className="bi bi-heart empty-state-icon"></i>
                <h3 className="empty-state-heading mt-3">Your wishlist is empty</h3>
                <p className="empty-state-text mb-4">Browse games and heart the ones you like</p>
                <button 
                  onClick={() => onSectionSwitch?.('categories')} 
                  className="empty-state-btn"
                  type="button"
                >
                  Browse Games
                </button>
              </div>
            </div>
          ) : (
            games.map(game => <GameCard key={game._id} game={game} onGameClick={onGameClick} />)
          )}
        </div>
      </div>

      <RecommendModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        libraryGames={games}
        onSearchGame={onSearchGame}
      />
    </section>
  );
}

export default MyLibrary;
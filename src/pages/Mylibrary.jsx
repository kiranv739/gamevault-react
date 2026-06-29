import React from 'react';
import './mylibrary.css';
import GameCard from '../components/GameCard';

function MyLibrary({ games, reference, onGameClick, onSectionSwitch }) {
  return (
    <section id="wishlist" className="wishlist" ref={reference}>
      <div className="container-fluid">
        <div className="row mb-3">
          <h1>My Wishlist</h1>
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
    </section>
  );
}

export default MyLibrary;
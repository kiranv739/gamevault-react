import React from 'react';
import './library.css';
import GameCard from '../components/GameCard';

function Library({ games, reference, onGameClick, onSectionSwitch }) {
  return (
    <section id="library" className="library" ref={reference}>
      <div className="container-fluid">
        <div className="row mb-3">
          <h1>My Library</h1>
        </div>
        <div className="row">
          {games.length === 0 ? (
            <div className="col-12">
              <div className="empty-state-container py-5 text-center">
                <i className="bi bi-controller empty-state-icon"></i>
                <h3 className="empty-state-heading mt-3">Your library is empty</h3>
                <p className="empty-state-text mb-4">Go buy some games and start playing!</p>
                <button 
                  onClick={() => onSectionSwitch?.('home')} 
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

export default Library;

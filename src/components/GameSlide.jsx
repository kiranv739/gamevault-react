import React from 'react';

function GameSlide({ game, active, onGameClick }) {
  return (
    <div className="gameSlider">
      <div className="gameSliderContent">
        <img src={game.img} alt={game.title} />
        <div className="content">
          <h2>{game.title}</h2>
          <p>{game.description}</p>
          <div className="buttons">
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); onGameClick?.(game); }}
              className="btn btn-link p-0 text-decoration-none orderBtn"
            >
              View Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameSlide;

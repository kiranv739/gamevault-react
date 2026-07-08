import React from 'react';

function GameSlide({ game, active, onGameClick }) {
  return (
    <div className="gameSlider">
      <div className="gameSliderContent">
        <img src={game.img} alt='game image' />
        <div className="content">
          <h2>{game.title}</h2>
          <p>{game.description}</p>
          <div className="buttons">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onGameClick?.(game); }}
              className="orderBtn"
            >
              View Game
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameSlide;

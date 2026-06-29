import React, { useContext } from 'react';
import './gameCard.css';
import GameRating from './GameRating';
import { AppContext } from '../App';

function GameCard({ game, onGameClick }) {
  const { library, setLibrary, bag, setBag, showToast } = useContext(AppContext);

  const isInLibrary = library.some((item) => item._id === game._id);
  const isInBag = bag.some((item) => item._id === game._id);

  const handleAddToLibrary = (e, gameItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInLibrary) {
      setLibrary([...library, gameItem]);
      showToast('Added to wishlist ♥', 'success');
    }
  };

  const handleRemoveFromLibrary = (e, gameItem) => {
    e.preventDefault();
    e.stopPropagation();
    setLibrary(library.filter((item) => item._id !== gameItem._id));
    showToast('Removed from wishlist', 'info');
  };
  
  const handleAddToBag = (e, gameItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInBag) {
      setBag([...bag, gameItem]);
      showToast('Added to cart ✓', 'success');
    }
  };

  return (
    <div className="col-xl-3 col-lg-4 col-md-6">
      <div className="gameCard">
        {/* Clickable Image wrapper */}
        <div 
          className="gameCard-image-wrapper" 
          onClick={() => onGameClick?.(game)}
          style={{ cursor: 'pointer' }}
        >
          <img src={game.img} alt={game.title} className="img-fluid" />
        </div>

        {/* Wishlist Heart Icon */}
        <a 
          href="#"
          className={`like ${isInLibrary ? 'active' : undefined}`}
          onClick={(e) =>
            isInLibrary
              ? handleRemoveFromLibrary(e, game)
              : handleAddToLibrary(e, game)
          }
        >
          <i className="bi bi-heart-fill"></i>
        </a>

        <div className="gameFeature">
          <span className="gameType">{game.level}</span>
          <GameRating rating={game.rating} />
        </div>

        {/* Clickable Game Title */}
        <div 
          className="gameTitle mt-4 mb-3" 
          onClick={() => onGameClick?.(game)}
          style={{ cursor: 'pointer' }}
        >
          {game.title}
        </div>

        <div className="gamePrice">
          {game.discount !== 0 && (
            <>
              <span className="discount">
                <i>{game.discount * 100}%</i>
              </span>
              <span className="prevPrice">₹{game.price.toFixed(2)}</span>
            </>
          )}
          <span className="currentPrice">
            ₹{((1 - game.discount) * game.price).toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Icon Button */}
        <a 
          href="#" 
          className={`addBag ${isInBag ? 'active' : ''}`}
          onClick={(e) => handleAddToBag(e, game)}
        >
          <i className={`bi ${isInBag ? 'bi-bag-check-fill' : 'bi-bag-plus-fill'}`}></i>
        </a>
      </div>
    </div>
  );
}

export default GameCard;
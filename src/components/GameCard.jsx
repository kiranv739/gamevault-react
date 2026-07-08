import React from 'react';
import './gameCard.css';
import GameRating from './GameRating';
import { useLibraryStore } from '../store/useLibraryStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';

function GameCard({ game, onGameClick }) {
  const library = useLibraryStore((state) => state.library);
  const addToLibrary = useLibraryStore((state) => state.addToLibrary);
  const removeFromLibrary = useLibraryStore((state) => state.removeFromLibrary);

  const bag = useCartStore((state) => state.bag);
  const addToCart = useCartStore((state) => state.addToCart);

  const showToast = useToastStore((state) => state.showToast);

  const isInLibrary = library.some((item) => item._id === game._id);
  const isInBag = bag.some((item) => item._id === game._id);

  const handleAddToLibrary = (e, gameItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToLibrary(gameItem, showToast);
  };

  const handleRemoveFromLibrary = (e, gameItem) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromLibrary(gameItem._id, showToast);
  };
  
  const handleAddToBag = (e, gameItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(gameItem, showToast);
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
          <span className="gameType">{game.category}</span>
          <div className="d-flex align-items-center gap-2">
            <GameRating rating={game.rating} />
            <span className="rating-number" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--glow)' }}>
              {game.rating.toFixed(1)}
            </span>
          </div>
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
              <span className="prevPrice">₹{Math.round(game.price).toLocaleString('en-IN')}</span>
            </>
          )}
          <span className="currentPrice">
            ₹{Math.round((1 - game.discount) * game.price).toLocaleString('en-IN')}
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
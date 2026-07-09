import React from 'react';
import './gameCard.css';
import GameRating from './GameRating';
import { useLibraryStore } from '../store/useLibraryStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';

function GameCard({ game, onGameClick, isLibraryCard = false }) {
  const wishlist = useLibraryStore((state) => state.wishlist);
  const purchasedGames = useLibraryStore((state) => state.purchasedGames);
  const addToWishlist = useLibraryStore((state) => state.addToWishlist);
  const removeFromWishlist = useLibraryStore((state) => state.removeFromWishlist);

  const bag = useCartStore((state) => state.bag);
  const addToCart = useCartStore((state) => state.addToCart);

  const showToast = useToastStore((state) => state.showToast);

  const isInWishlist = wishlist.some((item) => item._id === game._id);
  const isPurchased = purchasedGames.some((item) => item._id === game._id);
  const isInBag = bag.some((item) => item._id === game._id);

  const handleAddToWishlist = (e, gameItem) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(gameItem, showToast);
  };

  const handleRemoveFromWishlist = (e, gameItem) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(gameItem._id, showToast);
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

        {/* Action Badge / Heart Icon */}
        {isPurchased ? (
          <button 
            type="button"
            className="btn btn-link p-0 text-decoration-none like active"
            title="Owned"
            style={{ cursor: 'default' }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <i className="bi bi-controller"></i>
          </button>
        ) : (
          !isLibraryCard && (
            <button 
              type="button"
              className={`btn btn-link p-0 text-decoration-none like ${isInWishlist ? 'active' : ''}`}
              onClick={(e) =>
                isInWishlist
                  ? handleRemoveFromWishlist(e, game)
                  : handleAddToWishlist(e, game)
              }
            >
              <i className="bi bi-heart-fill"></i>
            </button>
          )
        )}

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
          className="gameTitle mt-4 mb-1" 
          onClick={() => onGameClick?.(game)}
          style={{ cursor: 'pointer' }}
        >
          {game.title}
        </div>

        {game.reason && (
          <p className="reason-text text small italic mb-3" style={{ fontSize: '0.8rem', lineHeight: '1.4', minHeight: '34px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            <i className="bi bi-quote me-1"></i>
            {game.reason}
          </p>
        )}

        {isLibraryCard ? (
          <div className="d-flex align-items-center mt-auto w-100">
            <button 
              type="button" 
              className="w-100 py-2 btn-place-order d-flex align-items-center justify-content-center gap-2"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Starting ${game.title}... 🎮`); }}
            >
              <i className="bi bi-play-fill" style={{ fontSize: '1.2rem' }}></i>
              Play
            </button>
          </div>
        ) : (
          <div className="gamePrice-row">
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
            {!isPurchased && (
              <button 
                type="button"
                className={`btn btn-link p-0 text-decoration-none addBag ${isInBag ? 'active' : ''}`}
                onClick={(e) => handleAddToBag(e, game)}
              >
                <i className={`bi ${isInBag ? 'bi-bag-check-fill' : 'bi-bag-plus-fill'}`}></i>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameCard;
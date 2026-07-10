import React, { useEffect, useRef } from 'react';
import './home.css';
import GameSwiper from '../components/GameSwiper';
import GameCard from '../components/GameCard';
import SkeletonCard from '../components/SkeletonCard';
import { useLibraryStore } from '../store/useLibraryStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useRecommendStore } from '../store/useRecommendStore';

function Home({ games, reference, onSectionSwitch, onGenreFilter, onGameClick, isLoading, onSearchGame }) {
  const isGuest = useAuthStore((state) => state.isGuest);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const wishlist = useLibraryStore((state) => state.wishlist);
  const bag = useCartStore((state) => state.bag);

  const recommendations = useRecommendStore((state) => state.recommendations);
  const hasFetched = useRecommendStore((state) => state.hasFetched);
  const loadingRecs = useRecommendStore((state) => state.isLoading);
  const recsError = useRecommendStore((state) => state.error);
  const fetchRecommendations = useRecommendStore((state) => state.fetchRecommendations);

  const recsStripRef = useRef(null);
  const saleStripRef = useRef(null);
  const ratedStripRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || isGuest) return;
    if (hasFetched) return;
    if (wishlist.length === 0 && bag.length === 0) return;
    
    const gameIds = [
      ...wishlist.slice(0, 5).map(g => g._id),
      ...bag.slice(0, 5).map(g => g._id)
    ];
    const genres = [...new Set(wishlist.map(g => g.category).filter(Boolean))];
    
    fetchRecommendations(gameIds, genres);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isGuest, hasFetched, fetchRecommendations]);

  // 2. Filter On Sale games (discount > 0), limit to 6
  const onSaleGames = games.filter((game) => game.discount > 0).slice(0, 6);

  // 3. Filter Top Rated games (sorted descending by rating), limit to 6
  const topRatedGames = [...games]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const isLibraryAndCartEmpty = wishlist.length === 0 && bag.length === 0;

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="home active" ref={reference}>
      <div className="container-fluid">
        {/* Swiper Hero Swiper */}
        <div className="row">
          {games && games.length > 0 && <GameSwiper games={games} onGameClick={onGameClick} />}
        </div>

        {/* Recommended For You Section */}
        {!isGuest && (
          isLibraryAndCartEmpty ? (
            <div className="section-container mb-5 animate-fade-in">
              <div className="row mb-3">
                <div className="col-12">
                  <h2 className="sectionTitle mb-0">Recommended For You</h2>
                </div>
              </div>
              <div className="empty-state-container py-5 text-center">
                <i className="bi bi-heart empty-state-icon"></i>
                <h3 className="empty-state-heading mt-3">Add games to your wishlist to get personalized recommendations</h3>
                <button 
                  onClick={() => onSectionSwitch?.('categories')} 
                  className="empty-state-btn mt-3"
                  type="button"
                >
                  Browse Games
                </button>
              </div>
            </div>
          ) : (
            <div className="section-container mb-5 animate-fade-in">
              <div className="row mb-3">
                <div className="col-12">
                  <h2 className="sectionTitle mb-0">✨ Recommended For You</h2>
                </div>
              </div>
              <div className="scrollable-strip-wrapper">
                <button className="strip-arrow strip-arrow-left" onClick={() => scroll(recsStripRef, 'left')} aria-label="Scroll left">
                  <i className="bi bi-chevron-left"></i>
                </button>
                <div className="scrollable-strip" ref={recsStripRef}>
                  {loadingRecs ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <SkeletonCard key={`rec-skeleton-${index}`} />
                    ))
                  ) : recsError || recommendations.length === 0 ? (
                    <div className="w-100 text-center py-4">
                      <p className="text-muted">No recommendations available.</p>
                    </div>
                  ) : (
                    recommendations.map((game) => (
                      <GameCard 
                        key={`rec-${game._id}`} 
                        game={game} 
                        onGameClick={onGameClick} 
                      />
                    ))
                  )}
                </div>
                <button className="strip-arrow strip-arrow-right" onClick={() => scroll(recsStripRef, 'right')} aria-label="Scroll right">
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          )
        )}

        {/* 2. ON SALE SECTION */}
        <div className="section-container mb-5">
          <div className="row align-items-center mb-3">
            <div className="col-6">
              <h2 className="sectionTitle mb-0">🔥 On Sale</h2>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button
                onClick={() => onSectionSwitch?.('categories')}
                className="viewMore-btn"
              >
                View All <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
          <div className="scrollable-strip-wrapper">
            <button className="strip-arrow strip-arrow-left" onClick={() => scroll(saleStripRef, 'left')} aria-label="Scroll left">
              <i className="bi bi-chevron-left"></i>
            </button>
            <div className="scrollable-strip" ref={saleStripRef}>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonCard key={`sale-skeleton-${index}`} />
                ))
              ) : (
                onSaleGames.map((game) => (
                  <GameCard 
                    key={`sale-${game._id}`} 
                    game={game} 
                    onGameClick={onGameClick} 
                  />
                ))
              )}
            </div>
            <button className="strip-arrow strip-arrow-right" onClick={() => scroll(saleStripRef, 'right')} aria-label="Scroll right">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* 4. TOP RATED SECTION */}
        <div className="section-container mb-4">
          <div className="row mb-3">
            <div className="col-12">
              <h2 className="sectionTitle">⭐ Top Rated</h2>
            </div>
          </div>
          <div className="scrollable-strip-wrapper">
            <button className="strip-arrow strip-arrow-left" onClick={() => scroll(ratedStripRef, 'left')} aria-label="Scroll left">
              <i className="bi bi-chevron-left"></i>
            </button>
            <div className="scrollable-strip" ref={ratedStripRef}>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonCard key={`rated-skeleton-${index}`} />
                ))
              ) : (
                topRatedGames.map((game) => (
                  <GameCard 
                    key={`rated-${game._id}`} 
                    game={game} 
                    onGameClick={onGameClick} 
                  />
                ))
              )}
            </div>
            <button className="strip-arrow strip-arrow-right" onClick={() => scroll(ratedStripRef, 'right')} aria-label="Scroll right">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
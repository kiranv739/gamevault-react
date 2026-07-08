import React from 'react';
import './home.css';
import GameSwiper from '../components/GameSwiper';
import GameCard from '../components/GameCard';
import SkeletonCard from '../components/SkeletonCard';

function Home({ games, reference, onSectionSwitch, onGenreFilter, onGameClick, isLoading }) {
  // 2. Filter On Sale games (discount > 0), limit to 6
  const onSaleGames = games.filter((game) => game.discount > 0).slice(0, 6);

  // 3. Filter Top Rated games (sorted descending by rating), limit to 6
  const topRatedGames = [...games]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  return (
    <section id="home" className="home active" ref={reference}>
      <div className="container-fluid">
        {/* Swiper Hero Swiper */}
        <div className="row">
          {games && games.length > 0 && <GameSwiper games={games} onGameClick={onGameClick} />}
        </div>



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
            <div className="scrollable-strip">
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
            <div className="scrollable-strip">
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
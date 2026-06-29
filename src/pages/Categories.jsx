import React, { useState } from 'react';
import './categories.css';
import filterListData from '../data/filterListData.js'; 
import GameCard from '../components/GameCard';
import SkeletonGrid from '../components/SkeletonGrid';

function Categories({ games, reference, selectedGenre, setSelectedGenre, searchQuery, onGameClick, isLoading, onClearFilters }) {
  const [filters] = useState(filterListData);

  // 1. Calculate active matches dynamically during render
  const filteredGames = games.filter((game) => {
    const matchesGenre = selectedGenre === 'All' || game.category === selectedGenre;
    const matchesSearch =
      !searchQuery ||
      game.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <section id="categories" className="categories" ref={reference}>
      <div className="container-fluid mt-2">
        {/* Filters Row */}
        <div className="row">
          <div className="col-12 d-flex align-items-center justify-content-start">
            <ul className="filters">
              {filters.map((filter) => (
                <li
                  key={filter._id}
                  className={filter.name === selectedGenre ? 'active' : undefined}
                  onClick={() => setSelectedGenre?.(filter.name)}
                >
                  {filter.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Games Grid Row / Loading Loader */}
        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="row">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <GameCard key={game._id} game={game} onGameClick={onGameClick} />
              ))
            ) : (
              <div className="col-12">
                <div className="empty-state-container py-5 text-center">
                  <i className="bi bi-search empty-state-icon"></i>
                  <h3 className="empty-state-heading mt-3">No games found</h3>
                  <p className="empty-state-text mb-4">Try a different search term or category</p>
                  <button 
                    onClick={onClearFilters} 
                    className="empty-state-btn"
                    type="button"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
import React, { useState } from 'react';
import './categories.css';
import filterListData from '../data/filterListData.js'; 
import GameCard from '../components/GameCard';
import SkeletonGrid from '../components/SkeletonGrid';

function Categories({ games, reference, selectedGenre, setSelectedGenre, searchQuery, onGameClick, isLoading, onClearFilters }) {
  const [filters] = useState(filterListData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        <div className="row mb-4">
          <div className="col-12 d-flex align-items-center justify-content-start gap-3">
            <div className="category-filter-dropdown-wrapper">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`filter-dropdown-btn ${selectedGenre !== 'All' ? 'active' : ''}`}
                type="button"
              >
                <i className="bi bi-funnel-fill me-2"></i>
                {selectedGenre === 'All' ? 'Filter Games' : `Genre: ${selectedGenre}`}
                <i className={`bi bi-chevron-down ms-2 dropdown-arrow-icon ${isDropdownOpen ? 'open' : ''}`}></i>
              </button>

              {isDropdownOpen && (
                <>
                  <div className="filter-dropdown-overlay" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="filter-dropdown-menu fade-in">
                    {filters.filter(f => f.name !== 'All').map((filter) => (
                      <button
                        key={filter.id || filter._id}
                        onClick={() => {
                          setSelectedGenre?.(filter.name);
                          setIsDropdownOpen(false);
                        }}
                        className={`filter-dropdown-item ${selectedGenre === filter.name ? 'selected' : ''}`}
                        type="button"
                      >
                        {filter.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {selectedGenre !== 'All' && (
              <button 
                onClick={() => setSelectedGenre?.('All')} 
                className="active-filter-chip"
                type="button"
                aria-label="Clear filter"
              >
                <span>{selectedGenre}</span>
                <i className="bi bi-x-lg ms-2"></i>
              </button>
            )}
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
import React, { useState, useEffect } from 'react';
import './categories.css';
import filterListData from '../data/filterListData.js'; 
import GameCard from '../components/GameCard';
import SkeletonGrid from '../components/SkeletonGrid';
import { getGames } from '../api/games';

function Categories({ reference, selectedGenre, setSelectedGenre, searchQuery, onGameClick, onClearFilters }) {
  const [filters] = useState(filterListData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pagination and data states
  const [localGames, setLocalGames] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Debounce search query by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch function
  const fetchGamesData = async (search, genre, targetPage, append = false) => {
    setIsLoadingLocal(true);
    try {
      const data = await getGames(search, genre, targetPage);
      if (append) {
        setLocalGames(prev => {
          const combined = [...prev];
          data.forEach(item => {
            if (!combined.some(g => g._id === item._id)) {
              combined.push(item);
            }
          });
          return combined;
        });
      } else {
        setLocalGames(data);
      }
      // If we receive less than 20 games (backend limit is 20), we reached the end
      setHasMore(data.length === 20);
    } catch (error) {
      console.error('Error fetching games in Categories:', error);
    } finally {
      setIsLoadingLocal(false);
    }
  };

  // Reset page and fetch when genre or search query changes
  useEffect(() => {
    setPage(1);
    fetchGamesData(debouncedSearchQuery, selectedGenre, 1, false);
  }, [debouncedSearchQuery, selectedGenre]);

  // Fetch next page when page increments
  useEffect(() => {
    if (page > 1) {
      fetchGamesData(debouncedSearchQuery, selectedGenre, page, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
        {isLoadingLocal && page === 1 ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="categories-grid">
            {localGames.length > 0 ? (
              <>
                {localGames.map((game) => (
                  <GameCard key={game._id} game={game} onGameClick={onGameClick} />
                ))}
                
                {/* Pagination "Load More" Button */}
                {hasMore && (
                  <div className="col-12 text-center mt-4 mb-4">
                    <button
                      type="button"
                      className="empty-state-btn"
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={isLoadingLocal}
                    >
                      {isLoadingLocal ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
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
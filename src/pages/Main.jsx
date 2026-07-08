import React, { useState, useEffect, useRef } from 'react';
import './main.css';
import SideMenu from '../components/SideMenu';
import Header from './Header';
import Home from './Home';
import Categories from './Categories';
import Mylibrary from './Mylibrary'; 
import Bag from './Bag';
import GameDetail from './GameDetail';
import Checkout from './Checkout';
import OrderConfirmation from './OrderConfirmation';
import Profile from './Profile';
import Library from './Library';
import { useLibraryStore } from '../store/useLibraryStore';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';
import { useAuthStore } from '../store/useAuthStore';

function Main() {
  const library = useLibraryStore((state) => state.library);
  const bag = useCartStore((state) => state.bag);
  const clearCart = useCartStore((state) => state.clearCart);
  const showToast = useToastStore((state) => state.showToast);
  const logout = useAuthStore((state) => state.logout);
  const [active, setActive] = useState(false);
  const [games, setGames] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [purchasedGames, setPurchasedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const homeRef = useRef();
  const categoriesRef = useRef();
  const libraryRef = useRef();
  const wishlistRef = useRef();
  const bagRef = useRef();
  const checkoutRef = useRef();
  const confirmationRef = useRef();
  const profileRef = useRef();

  const sections = [
    {
      name: 'home',
      ref: homeRef,
      active: true,
    },
    {
      name: 'categories',
      ref: categoriesRef,
      active: false,
    },
    {
      name: 'library',
      ref: libraryRef,
      active: false,
    },
    {
      name: 'wishlist',
      ref: wishlistRef,
      active: false,
    },
    {
      name: 'bag',
      ref: bagRef,
      active: false,
    },
    {
      name: 'checkout',
      ref: checkoutRef,
      active: false,
    },
    {
      name: 'confirmation',
      ref: confirmationRef,
      active: false,
    },
    {
      name: 'profile',
      ref: profileRef,
      active: false,
    },
  ];


  const handleToggleActive = () => {
    setActive(!active);
  };

  const handleSectionActive = target => {
    sections.map(section => {
     section.ref.current.classList.remove('active');
     if (section.ref.current.id === target){
      section.ref.current.classList.add('active');
     }
     return section;
    });
  };

  const fetchData = () => {
    setIsLoading(true);
    fetch('http://localhost:3000/api/gamesData.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setGames(data);
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      })
      .catch(e => {
        console.log(e.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (query) => {
    console.log('Search query submitted:', query);
    setSearchQuery(query);
    handleSectionActive('categories');
  };

  const handleProfile = () => {
    handleSectionActive('profile');
  };

  const handleOrders = () => {
    handleSectionActive('profile');
  };

  const handleLogout = () => {
    logout(showToast);
  };

  const handlePlaceOrder = () => {
    setPurchasedGames(prev => {
      const uniqueGames = [...prev];
      bag.forEach(item => {
        if (!uniqueGames.some(g => g._id === item._id)) {
          uniqueGames.push(item);
        }
      });
      return uniqueGames;
    });
    clearCart();
    showToast('Order placed successfully! 🎉', 'success');
    handleSectionActive('confirmation');
  };

  const handleClearFilters = () => {
    setSelectedGenre('All');
    setSearchQuery('');
  };

  return (
    <main>
      <SideMenu active={active} sectionActive={handleSectionActive} />
      <div className={`banner ${active ? 'active' : ''}`}>
        <Header 
          toggleActive={handleToggleActive} 
          onSearch={handleSearch}
          onProfile={handleProfile}
          onOrders={handleOrders}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          onWishlistClick={() => handleSectionActive('wishlist')}
          onCartClick={() => handleSectionActive('checkout')}
        />
        <div className="container-fluid">
          {(isLoading || (games && games.length > 0)) && (
          <>
            <Home 
              games={games} 
              reference={homeRef} 
              onSectionSwitch={handleSectionActive}
              onGenreFilter={setSelectedGenre}
              onGameClick={setSelectedGame}
              isLoading={isLoading}
            />
            <Categories 
              games={games} 
              reference={categoriesRef} 
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              searchQuery={searchQuery}
              onGameClick={setSelectedGame}
              isLoading={isLoading}
              onClearFilters={handleClearFilters}
            />
            <Mylibrary games={library} reference={wishlistRef} onGameClick={setSelectedGame} onSectionSwitch={handleSectionActive} />
            <Library games={purchasedGames} reference={libraryRef} onGameClick={setSelectedGame} onSectionSwitch={handleSectionActive} />
            <Bag games={bag} reference={bagRef} onCheckout={() => handleSectionActive('checkout')} onSectionSwitch={handleSectionActive} />
            <Checkout reference={checkoutRef} onPlaceOrder={handlePlaceOrder} />
            <OrderConfirmation 
              reference={confirmationRef} 
              purchasedGames={purchasedGames}
              onGoToLibrary={() => handleSectionActive('library')}
              onContinueShopping={() => handleSectionActive('home')}
            />
            <Profile reference={profileRef} onNavigate={handleSectionActive} />
          </>
          )}
        </div>
      </div>
      {selectedGame && (
        <GameDetail 
          game={selectedGame} 
          games={games} 
          onClose={() => setSelectedGame(null)} 
        />
      )}
    </main>
  );
}

export default Main;
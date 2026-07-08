import React, { useState , useEffect }from 'react';
import './bag.css';
import ShopBagItem from '../components/ShopBagitem';

function Bag({ games, reference, onCheckout, onSectionSwitch }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = games
      .map(game => game.price * (1 - game.discount))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
      .toFixed(2);
    setTotal(sum);
  }, [games]);

  return (
    <section id="bag" className="bag" ref={reference}>
      <div className="container-fluid">
        <div className="row mb-3">
          <h1>My Bag</h1>
        </div>
      </div>
      {games.length === 0 ? (
        <div className="empty-state-container py-5 text-center">
          <i className="bi bi-bag empty-state-icon"></i>
          <h3 className="empty-state-heading mt-3">Your cart is empty</h3>
          <p className="empty-state-text mb-4">Looks like you haven't added anything yet</p>
          <button 
            onClick={() => onSectionSwitch?.('home')} 
            className="empty-state-btn"
            type="button"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
        <div className="row">
          <div className="table-responsive">
            <table className="shopBagTable table table-borderless align-middle">
              <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Preview</th>
                  <th scope="col">Game</th>
                  <th scope="col">Price</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Remove</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game, index) => (
                  <ShopBagItem index={index} key={game._id} game={game} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
          <div className="row d-flex justify-content-between mt-5">
           <div className="col-lg-2 d-flex align-items-center">
             <p className="itemCount">Total Items: {games.length}</p>
            </div>
           <div className="col-lg-10 d-flex justify-content-end">
            <div className="payment">
             Total: ₹{total}
              <button type="button" className="btn btn-link p-0" onClick={(e) => { e.preventDefault(); onCheckout?.(); }}>
               <span>Proceed to Checkout</span> <i className="bi bi-wallet-fill"></i>
              </button>
             </div>
           </div>
          </div>
           </>
      )}
    </section>
  );
}

export default Bag;
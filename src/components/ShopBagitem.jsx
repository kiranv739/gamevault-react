import React from 'react';
import './shopBagitem.css';
import { useCartStore } from '../store/useCartStore';
import { useToastStore } from '../store/useToastStore';

function ShopBagItem({ game, index }) {
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const showToast = useToastStore((state) => state.showToast);

    const handleRemoveFromBag = game => {
      removeFromCart(game._id, showToast);
    };
  
  return (
    <tr className="shopBagItem">
      <th scope="row">{index + 1}</th>
      <td>
        <img src={game.img} alt="" className="img-fluid" />
      </td>
      <td>{game.title}</td>
      <td>${game.price.toFixed(2)}</td>
      <td>{game.discount * 100}%</td>
      <td>${(game.price * (1 - game.discount)).toFixed(2)}</td>
      <td>
        <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => handleRemoveFromBag(game)}>
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}

export default ShopBagItem;

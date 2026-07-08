import React from 'react'
import './gameRating.css'

function GameRating({rating}) {
  let stars = [];
  if (rating <= 5 && rating >= 1) {
    for (let i = 0; i < rating; i++) {
      stars.push(i);
    }
  }
  
  return (
    <div className="gameRating">
     {stars.map((star)=>(
        <i key={star} className="bi bi-star-fill"></i>
     ))}
    </div>
  )
}

export default GameRating
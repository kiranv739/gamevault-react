import React from 'react';
import './skeleton.css';

function SkeletonCard() {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6">
      <div className="gameCard skeleton-card">
        {/* Shimmer Image Area */}
        <div className="skeleton-image shimmer"></div>

        {/* Shimmer Level & Rating */}
        <div className="skeleton-features d-flex justify-content-between mt-3 mb-2">
          <div className="skeleton-type shimmer"></div>
          <div className="skeleton-rating shimmer"></div>
        </div>

        {/* Shimmer Title Lines */}
        <div className="skeleton-title shimmer w-75 mt-3"></div>
        <div className="skeleton-title shimmer w-50 mt-2"></div>

        {/* Shimmer Price & Cart Button */}
        <div className="skeleton-price-row d-flex justify-content-between align-items-center mt-auto">
          <div className="skeleton-price shimmer w-25"></div>
          <div className="skeleton-cart-btn shimmer"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;

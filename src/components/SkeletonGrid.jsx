import React from 'react';
import SkeletonCard from './SkeletonCard';

function SkeletonGrid({ count = 8 }) {
  const skeletons = Array.from({ length: count });

  return (
    <div className="row w-100 m-0">
      {skeletons.map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default SkeletonGrid;

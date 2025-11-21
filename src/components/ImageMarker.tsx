import React from 'react';
import { IconMarker } from '../types';
import './ImageMarker.less';

interface ImageMarkerProps {
  marker: IconMarker;
  onClick?: (marker: IconMarker) => void;
}

const ImageMarker: React.FC<ImageMarkerProps> = ({ marker, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(marker);
  };

  return (
    <div
      className="image-marker"
      style={{
        left: `${marker.x}%`,
        top: `${marker.y}%`,
      }}
      onClick={handleClick}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={marker.color}
          strokeWidth="3"
          fill="white"
          fillOpacity="0.9"
        />
        <circle
          cx="12"
          cy="12"
          r="6"
          fill={marker.color}
          fillOpacity="0.8"
        />
      </svg>
    </div>
  );
};

export default ImageMarker;
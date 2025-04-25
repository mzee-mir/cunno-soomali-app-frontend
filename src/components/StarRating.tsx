import React, { useState } from 'react';
import Sparkle from './starSparkle';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  sparkleColors?: string[];
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  sparkleColors = ['#FFC700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7FFF7',"#66ff33","#00ffff","#b30059","#001a66","#666666","#d06525","#ff9933","#ffcc99","##c22bbf","#ff9900","#ff6600","#ff3300","##e82e8e","#cc0000","#990000","#660000","#00ff00"]
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const [sparkles, setSparkles] = useState<number[]>([]);
  const [clickedStar, setClickedStar] = useState<number | null>(null);

  

  const handleClick = (value: number) => {
    onRatingChange(value);
    setSparkles([...sparkles, Date.now()]);
    setTimeout(() => setSparkles(prev => prev.slice(1)), 500);
    setClickedStar(value);
    setTimeout(() => setClickedStar(null), 300);
  };

  return (
    <div style={{ position: 'relative' }}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => handleClick(ratingValue)}
              style={{ display: 'none' }}
            />
            <span>
             <FaStar
              color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
              size={30}
              style={{  
                display: 'inline',
                transition: 'color 200ms, transform 150ms',
                transform: `scale(${
                  clickedStar === ratingValue
                    ? 0.5
                    : ratingValue <= (hover || rating)
                    ? 1.1
                    : 1
                })`,
              }}
              onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
            />
            </span>
          </label>
        );
      })}
      {sparkles.map(key => (
        <Sparkle key={key} colors={sparkleColors} />
      ))}
    </div>
  );
};

export default StarRating;
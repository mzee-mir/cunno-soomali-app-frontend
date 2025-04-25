import React, { useEffect, useState } from 'react';

interface SparkleProps {
  colors?: string[];
}

const Sparkle: React.FC<SparkleProps> = ({ colors = ['#FFC700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7FFF7',"#66ff33","#00ffff","#b30059","#001a66","#666666","#d06525","#ff9933","#ffcc99","##c22bbf","#ff9900","#ff6600","#ff3300","##e82e8e","#cc0000","#990000","#660000","#00ff00"] }) => {
    const [position1, setPosition1] = useState({ x: 0, y: 0 });
    const [position2, setPosition2] = useState({ x: 0, y: 0 });
    const [position3, setPosition3] = useState({ x: 0, y: 0 });
    const [color1, setColor1] = useState(colors[0]);
    const [color2, setColor2] = useState(colors[1]);
    const [color3, setColor3] = useState(colors[2]);

  useEffect(() => {
    const x1 = Math.random() * 100;
    const y1 = Math.random() * 100;
    const x2 = Math.random() * 100;
    const y2 = Math.random() * 100;
    const x3 = Math.random() * 100;
    const y3 = Math.random() * 100;
    // Set positions for all three
    setPosition1({ x: x1, y: y1 });
    setPosition2({ x: x2, y: y2 });
    setPosition3({ x: x3, y: y3 });
    
    // Set random colors for all three
    setColor1(colors[Math.floor(Math.random() * colors.length)]);
    setColor2(colors[Math.floor(Math.random() * colors.length)]);
    setColor3(colors[Math.floor(Math.random() * colors.length)]);
  }, [colors]);

  return (
    <>
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{
        position: 'absolute',
        left: `${position1.x}%`,
        top: `${position1.y}%`,
        animation: 'sparkle 1s linear forwards',
        fill: color1, // Dynamic color
      }}
    >
      <path
        d="M10 1.5L12.09 7.26L18.18 7.64L13.54 11.66L14.82 17.5L10 14.27L5.18 17.5L6.46 11.66L1.82 7.64L7.91 7.26L10 1.5Z"
        fill={color1}
      />
    </svg>

    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{
        position: 'absolute',
        left: `${position2.x}%`,
        top: `${position2.y}%`,
        animation: 'sparkle 1s linear forwards',
        fill: color2, // Dynamic color
      }}
    >
      <path
        d="M10 1.5L12.09 7.26L18.18 7.64L13.54 11.66L14.82 17.5L10 14.27L5.18 17.5L6.46 11.66L1.82 7.64L7.91 7.26L10 1.5Z"
        fill={color2}
      />
    </svg>

    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{
        position: 'absolute',
        left: `${position3.x}%`,
        top: `${position3.y}%`,
        animation: 'sparkle 1s linear forwards',
        fill: color3, // Dynamic color
      }}
    >
      <path
        d="M10 1.5L12.09 7.26L18.18 7.64L13.54 11.66L14.82 17.5L10 14.27L5.18 17.5L6.46 11.66L1.82 7.64L7.91 7.26L10 1.5Z"
        fill={color3}
      />
    </svg>
  </>
  );
};

export default Sparkle;
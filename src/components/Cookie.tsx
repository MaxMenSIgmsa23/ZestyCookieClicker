import React from 'react';
import { CookieType } from '../types/game';

interface CookieProps {
  cookieType: CookieType;
  onClick: () => void;
  size?: number;
}

export const Cookie = ({ cookieType, onClick, size = 200 }: CookieProps) => {
  const handleClick = (e: React.MouseEvent) => {
    onClick();
    
    // Create click animation
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create floating text
    const floatingText = document.createElement('div');
    floatingText.textContent = '+1';
    floatingText.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      color: ${cookieType.glowColor};
      font-weight: bold;
      font-size: 18px;
      pointer-events: none;
      z-index: 1000;
      animation: float-up 1s ease-out forwards;
    `;
    
    e.currentTarget.appendChild(floatingText);
    setTimeout(() => floatingText.remove(), 1000);
  };

  return (
    <div className="relative flex items-center justify-center">
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.95);
          }
        }
        
        .cookie-bounce {
          animation: bounce 0.1s ease-in-out;
        }
      `}</style>
      
      <button
        onClick={handleClick}
        className="relative transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50 rounded-full overflow-hidden group"
        style={{
          width: size,
          height: size,
          boxShadow: `0 0 40px ${cookieType.glowColor}60, 0 0 80px ${cookieType.glowColor}30`,
        }}
      >
        {/* Cookie Image */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <img
            src={cookieType.imageUrl}
            alt={cookieType.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            style={{
              filter: `hue-rotate(${cookieType.hueRotate || 0}deg) saturate(${cookieType.saturation || 1}) brightness(${cookieType.brightness || 1})`,
            }}
          />
        </div>
        
        {/* Overlay effects */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-60"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
          }}
        />
        
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-30 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${cookieType.glowColor}40 0%, transparent 70%)`,
          }}
        />
        
        {/* Click ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-75" />
        
        {/* Particle effects */}
        <div className="absolute inset-0 rounded-full opacity-20 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full animate-ping"
              style={{
                top: `${20 + (i * 5)}%`,
                left: `${15 + (i * 6)}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '3s',
                boxShadow: `0 0 4px ${cookieType.glowColor}`,
              }}
            />
          ))}
        </div>
      </button>
      
      {/* Steam-like achievement popup area */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm opacity-0 transition-opacity duration-300 hover:opacity-100">
          Click for cookies!
        </div>
      </div>
    </div>
  );
};
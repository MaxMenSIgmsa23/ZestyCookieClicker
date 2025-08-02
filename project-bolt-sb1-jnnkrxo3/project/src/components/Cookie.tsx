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
        className="relative transition-all duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50 rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: cookieType.color,
          boxShadow: `0 0 30px ${cookieType.glowColor}40, inset 0 0 20px rgba(255,255,255,0.2)`,
          focusRingColor: cookieType.glowColor,
        }}
      >
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
          }}
        />
        
        <div className="relative z-10 text-6xl animate-pulse">
          {cookieType.emoji}
        </div>
        
        {/* Particle effects */}
        <div className="absolute inset-0 rounded-full opacity-30 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-800 rounded-full animate-ping"
              style={{
                top: `${20 + i * 10}%`,
                left: `${15 + i * 8}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
                boxShadow: '0 0 2px rgba(139,69,19,0.8)',
              }}
            />
          ))}
        </div>
        
        {/* Additional surface details */}
        <div className="absolute inset-4 rounded-full">
          {/* Cookie cracks and imperfections */}
          <div 
            className="absolute w-8 h-0.5 bg-black/20 rounded-full transform rotate-12"
            style={{ top: '30%', left: '25%' }}
          />
          <div 
            className="absolute w-6 h-0.5 bg-black/15 rounded-full transform -rotate-45"
            style={{ top: '60%', right: '30%' }}
          />
          <div 
            className="absolute w-4 h-0.5 bg-black/10 rounded-full transform rotate-75"
            style={{ bottom: '35%', left: '40%' }}
          />
        </div>
      </button>
    </div>
  );
};
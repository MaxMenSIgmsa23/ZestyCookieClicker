import React, { useEffect } from 'react';
import { GameState, CookieType } from '../types/game';
import { cookieTypes } from '../data/gameData';

interface CookieSelectorProps {
  gameState: GameState;
  onSwitchCookie: (cookieType: CookieType) => void;
  onUnlockCookie: (cookieType: CookieType) => void;
}

export const CookieSelector = ({ gameState, onSwitchCookie, onUnlockCookie }: CookieSelectorProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  };

  // Auto-unlock cookie types when requirements are met
  useEffect(() => {
    cookieTypes.forEach(cookieType => {
      const isUnlocked = gameState.unlockedCookieTypes.find(ct => ct.id === cookieType.id);
      if (!isUnlocked && gameState.totalCookies >= cookieType.unlockRequirement) {
        onUnlockCookie(cookieType);
      }
    });
  }, [gameState.totalCookies, gameState.unlockedCookieTypes, onUnlockCookie]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-pink-200">
      <h2 className="text-2xl font-bold text-pink-800 mb-4 flex items-center gap-2">
        <span className="text-3xl">🍪</span>
        Cookie Arsenal
      </h2>
      
      <div className="grid gap-3">
        {cookieTypes.map(cookieType => {
          const isUnlocked = gameState.unlockedCookieTypes.find(ct => ct.id === cookieType.id);
          const isCurrent = gameState.currentCookieType.id === cookieType.id;
          const canAfford = gameState.cookies >= cookieType.unlockCost;
          const meetsRequirement = gameState.totalCookies >= cookieType.unlockRequirement;
          
          if (!isUnlocked && !meetsRequirement) {
            return (
              <div key={cookieType.id} className="p-3 rounded-lg bg-gray-100 border-2 border-gray-300 opacity-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl grayscale">🔒</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-600">???</div>
                    <div className="text-sm text-gray-500">
                      Unlock at {formatNumber(cookieType.unlockRequirement)} total cookies
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          
          return (
            <button
              key={cookieType.id}
              onClick={() => isUnlocked && canAfford ? onSwitchCookie(cookieType) : undefined}
              disabled={!isUnlocked || (cookieType.unlockCost > 0 && !canAfford)}
              className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                isCurrent
                  ? 'bg-gradient-to-r from-yellow-200 to-orange-200 border-yellow-400 ring-2 ring-yellow-400'
                  : isUnlocked
                  ? canAfford || cookieType.unlockCost === 0
                    ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-300 hover:from-pink-200 hover:to-purple-200 hover:scale-102 cursor-pointer'
                    : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                  : 'bg-green-100 border-green-300 animate-pulse'
              }`}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="text-3xl"
                  style={{ 
                    filter: isCurrent ? `drop-shadow(0 0 8px ${cookieType.glowColor})` : 'none' 
                  }}
                >
                  {cookieType.emoji}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 flex items-center gap-2">
                    {cookieType.name}
                    {isCurrent && <span className="text-yellow-600 text-sm">(Active)</span>}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{cookieType.description}</div>
                  <div className="text-xs text-gray-500 flex gap-4">
                    {cookieType.clickMultiplier !== 1 && (
                      <span>Click: {cookieType.clickMultiplier}x</span>
                    )}
                    {cookieType.passiveMultiplier !== 1 && (
                      <span>Passive: {cookieType.passiveMultiplier}x</span>
                    )}
                  </div>
                  {cookieType.unlockCost > 0 && !isCurrent && (
                    <div className="text-sm font-bold text-purple-600 mt-1">
                      Cost: {formatNumber(cookieType.unlockCost)} 🍪
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
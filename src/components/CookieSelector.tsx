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

  useEffect(() => {
    cookieTypes.forEach(cookieType => {
      const isUnlocked = gameState.unlockedCookieTypes.find(ct => ct.id === cookieType.id);
      if (!isUnlocked && gameState.totalCookies >= cookieType.unlockRequirement) {
        onUnlockCookie(cookieType);
      }
    });
  }, [gameState.totalCookies, gameState.unlockedCookieTypes, onUnlockCookie]);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Cookie Arsenal</h2>
        <p className="text-slate-400">Choose your weapon of mass production</p>
      </div>
      
      <div className="space-y-3">
        {cookieTypes.map(cookieType => {
          const isUnlocked = gameState.unlockedCookieTypes.find(ct => ct.id === cookieType.id);
          const isCurrent = gameState.currentCookieType.id === cookieType.id;
          const canAfford = gameState.cookies >= cookieType.unlockCost;
          const meetsRequirement = gameState.totalCookies >= cookieType.unlockRequirement;
          
          if (!isUnlocked && !meetsRequirement) {
            return (
              <div key={cookieType.id} className="p-4 rounded-lg bg-slate-800 border border-slate-600 opacity-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-600 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-500">Classified</div>
                    <div className="text-sm text-slate-600">
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
              className={`w-full p-4 rounded-lg text-left transition-all duration-200 border ${
                isCurrent
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400 shadow-lg shadow-yellow-500/30'
                  : isUnlocked
                  ? canAfford || cookieType.unlockCost === 0
                    ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-purple-500 hover:from-slate-600 hover:to-slate-500 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-purple-500/20'
                    : 'bg-slate-800 border-slate-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-green-800 to-green-700 border-green-500 animate-pulse'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={cookieType.imageUrl}
                    alt={cookieType.name}
                    className="w-full h-full object-cover"
                    style={{
                      filter: `hue-rotate(${cookieType.hueRotate || 0}deg) saturate(${cookieType.saturation || 1}) brightness(${cookieType.brightness || 1})`,
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white flex items-center gap-2">
                      {cookieType.name}
                      {isCurrent && <span className="text-yellow-400 text-sm">(ACTIVE)</span>}
                    </span>
                    {cookieType.unlockCost > 0 && !isCurrent && (
                      <span className="text-purple-400 font-bold">{formatNumber(cookieType.unlockCost)}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{cookieType.description}</p>
                  <div className="flex gap-4 text-xs text-slate-400">
                    {cookieType.clickMultiplier !== 1 && (
                      <span className="text-orange-400">Click: {cookieType.clickMultiplier}x</span>
                    )}
                    {cookieType.passiveMultiplier !== 1 && (
                      <span className="text-blue-400">Passive: {cookieType.passiveMultiplier}x</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
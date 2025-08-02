import React from 'react';
import { GameState } from '../types/game';

interface PrestigePanelProps {
  gameState: GameState;
  onPrestige: () => void;
}

export const PrestigePanel = ({ gameState, onPrestige }: PrestigePanelProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  };

  const canPrestige = gameState.totalCookies >= 1000000;
  const dominanceGain = Math.floor(gameState.totalCookies / 1000000);
  const newClickPower = 1 + (gameState.dominancePoints + dominanceGain) * 0.1;

  if (!canPrestige && gameState.prestigeLevel === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-900 to-black rounded-xl p-6 shadow-2xl border-2 border-purple-500">
      <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
        <span className="text-3xl">👑</span>
        Kneel Again (Prestige)
      </h2>
      
      <div className="space-y-4">
        <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-400">
          <div className="text-purple-200 mb-2">
            <strong>Current Prestige Level:</strong> {gameState.prestigeLevel}
          </div>
          <div className="text-purple-200 mb-2">
            <strong>Dominance Points:</strong> {gameState.dominancePoints}
          </div>
          <div className="text-purple-200">
            <strong>Current Click Power Bonus:</strong> +{((gameState.dominancePoints * 0.1) * 100).toFixed(1)}%
          </div>
        </div>
        
        {canPrestige && (
          <div className="bg-yellow-900/50 rounded-lg p-4 border border-yellow-400">
            <div className="text-yellow-200 mb-2">
              <strong>Dominance Points on Reset:</strong> +{dominanceGain}
            </div>
            <div className="text-yellow-200 mb-4">
              <strong>New Click Power:</strong> {newClickPower.toFixed(1)} (+{((newClickPower - 1) * 100).toFixed(1)}%)
            </div>
            
            <button
              onClick={onPrestige}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              🌟 Kneel Again & Reset Empire 🌟
            </button>
          </div>
        )}
        
        {!canPrestige && (
          <div className="bg-red-900/50 rounded-lg p-4 border border-red-400">
            <div className="text-red-200 text-center">
              <strong>Need 1M total cookies to prestige</strong>
            </div>
            <div className="text-red-300 text-center text-sm mt-1">
              Progress: {formatNumber(gameState.totalCookies)} / 1M
            </div>
          </div>
        )}
        
        <div className="text-xs text-purple-400 text-center">
          ⚠️ Prestiging resets all progress but grants permanent bonuses
        </div>
      </div>
    </div>
  );
};
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
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Prestige System</h2>
          <p className="text-slate-400">Ascend to greater power</p>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 text-center">
          <div className="text-slate-400 mb-4">
            Prestige system will unlock when you reach 1 million total cookies.
          </div>
          <div className="text-slate-500 text-sm">
            Current progress: {formatNumber(gameState.totalCookies)} / 1M
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Prestige System</h2>
        <p className="text-slate-400">Reset your empire for permanent power</p>
      </div>
      
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg p-6 border border-purple-500 shadow-lg">
        <div className="space-y-4">
          <div className="bg-purple-800/50 rounded-lg p-4 border border-purple-400">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-300">{gameState.prestigeLevel}</div>
                <div className="text-sm text-purple-400">Prestige Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-300">{gameState.dominancePoints}</div>
                <div className="text-sm text-purple-400">Dominance Points</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-purple-200">
                <strong>Current Click Power Bonus:</strong> +{((gameState.dominancePoints * 0.1) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          {canPrestige && (
            <div className="bg-yellow-900/50 rounded-lg p-4 border border-yellow-400">
              <div className="text-center mb-4">
                <div className="text-yellow-200 mb-2">
                  <strong>Dominance Points on Reset:</strong> +{dominanceGain}
                </div>
                <div className="text-yellow-200 mb-4">
                  <strong>New Click Power:</strong> {newClickPower.toFixed(1)} (+{((newClickPower - 1) * 100).toFixed(1)}%)
                </div>
              </div>
              
              <button
                onClick={onPrestige}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg text-lg"
              >
                🌟 ASCEND & RESET EMPIRE 🌟
              </button>
            </div>
          )}
          
          {!canPrestige && (
            <div className="bg-red-900/50 rounded-lg p-4 border border-red-400 text-center">
              <div className="text-red-200 font-semibold mb-2">
                Need 1M total cookies to prestige
              </div>
              <div className="text-red-300 text-sm">
                Progress: {formatNumber(gameState.totalCookies)} / 1M
              </div>
            </div>
          )}
          
          <div className="text-xs text-purple-400 text-center bg-purple-900/30 rounded p-3">
            ⚠️ Warning: Prestiging resets all progress but grants permanent bonuses to click power
          </div>
        </div>
      </div>
    </div>
  );
};
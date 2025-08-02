import React from 'react';
import { GameState } from '../types/game';

interface StatsProps {
  gameState: GameState;
}

export const Stats = ({ gameState }: StatsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  };

  const playtime = Math.floor((Date.now() - gameState.stats.startTime) / 1000);
  const hours = Math.floor(playtime / 3600);
  const minutes = Math.floor((playtime % 3600) / 60);

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-600">
      <h2 className="text-2xl font-bold text-blue-300 mb-4 flex items-center gap-2">
        <span className="text-3xl">📊</span>
        Production Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 p-3 rounded-lg border border-blue-700/30">
          <div className="font-semibold text-blue-300">Total Cookies</div>
          <div className="text-xl font-bold text-white">{formatNumber(gameState.totalCookies)}</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 p-3 rounded-lg border border-green-700/30">
          <div className="font-semibold text-green-300">Cookies Per Second</div>
          <div className="text-xl font-bold text-white">{formatNumber(gameState.cookiesPerSecond)}</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-3 rounded-lg border border-purple-700/30">
          <div className="font-semibold text-purple-300">Click Power</div>
          <div className="text-xl font-bold text-white">{formatNumber(gameState.clickPower)}</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 p-3 rounded-lg border border-orange-700/30">
          <div className="font-semibold text-orange-300">Total Clicks</div>
          <div className="text-xl font-bold text-white">{formatNumber(gameState.stats.totalClicks)}</div>
        </div>
        
        {gameState.prestigeLevel > 0 && (
          <>
            <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-3 rounded-lg border border-yellow-700/30">
              <div className="font-semibold text-yellow-300">Prestige Level</div>
              <div className="text-xl font-bold text-white">{gameState.prestigeLevel}</div>
            </div>
            
            <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 p-3 rounded-lg border border-red-700/30">
              <div className="font-semibold text-red-300">Dominance Points</div>
              <div className="text-xl font-bold text-white">{gameState.dominancePoints}</div>
            </div>
          </>
        )}
        
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-3 rounded-lg border border-indigo-700/30 col-span-2">
          <div className="font-semibold text-indigo-300">Session Time</div>
          <div className="text-lg font-bold text-white">
            {hours > 0 ? `${hours}h ` : ''}{minutes}m
          </div>
        </div>
      </div>
      
      {gameState.buffs.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-blue-300 mb-2">Active Buffs</h3>
          <div className="space-y-2">
            {gameState.buffs.map(buff => {
              const remaining = Math.ceil((buff.startTime + buff.duration * 1000 - Date.now()) / 1000);
              return (
                <div key={buff.id} className="bg-yellow-900/50 border border-yellow-700/30 p-2 rounded-lg flex items-center justify-between">
                  <span className="text-yellow-300 font-medium">
                    {buff.icon} {buff.name} ({buff.multiplier}x)
                  </span>
                  <span className="text-yellow-200 text-sm">{remaining}s</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
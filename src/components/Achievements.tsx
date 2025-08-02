import React from 'react';
import { GameState } from '../types/game';
import { achievements } from '../data/gameData';

interface AchievementsProps {
  gameState: GameState;
}

export const Achievements = ({ gameState }: AchievementsProps) => {
  const formatNumber = (num: number) => {
    if (num === undefined || num === null || isNaN(num)) {
      return '0';
    }
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  };

  const unlockedAchievements = achievements.filter(a => gameState.achievements.includes(a.id));
  const lockedAchievements = achievements.filter(a => !gameState.achievements.includes(a.id));

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Hall of Fame</h2>
        <p className="text-slate-400">
          Progress: {unlockedAchievements.length}/{achievements.length} achievements unlocked
        </p>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {/* Unlocked Achievements */}
        {unlockedAchievements.map(achievement => (
          <div
            key={achievement.id}
            className="p-4 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 border border-yellow-400 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <img src={achievement.icon} alt={achievement.name} className="w-8 h-8 rounded object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white flex items-center gap-2 mb-1">
                  {achievement.name}
                  <span className="text-green-300 text-sm font-bold">✓ UNLOCKED</span>
                </div>
                <div className="text-sm text-yellow-100 mb-1">{achievement.description}</div>
                <div className="text-xs text-yellow-200">
                  Reward: +{formatNumber(achievement.reward)} cookies
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Locked Achievements */}
        {lockedAchievements.map(achievement => {
          let progress = 0;
          let current = 0;
          
          switch (achievement.type) {
            case 'clicks':
              if (achievement.id === 'speed-demon') {
                current = gameState.stats.fastClicks;
              } else {
                current = gameState.stats.totalClicks;
              }
              progress = Math.min(current / achievement.requirement, 1);
              break;
            case 'cookies':
              current = gameState.totalCookies;
              progress = Math.min(current / achievement.requirement, 1);
              break;
            case 'generators':
              current = Object.values(gameState.generators).reduce((sum, count) => sum + count, 0);
              progress = Math.min(current / achievement.requirement, 1);
              break;
            case 'prestige':
              current = gameState.prestigeLevel;
              progress = Math.min(current / achievement.requirement, 1);
              break;
            case 'promo':
              current = gameState.stats.promosUsed?.length || 0;
              progress = Math.min(current / achievement.requirement, 1);
              break;
            case 'upgrades':
              current = Object.values(gameState.upgrades).reduce((sum, count) => sum + count, 0);
              progress = Math.min(current / achievement.requirement, 1);
              break;
            default:
              current = 0;
              progress = 0;
              break;
          }
          
          return (
            <div
              key={achievement.id}
              className="p-4 rounded-lg bg-slate-800 border border-slate-600 opacity-75"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img src={achievement.icon} alt={achievement.name} className="w-8 h-8 rounded object-cover grayscale" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-300 mb-1">{achievement.name}</div>
                  <div className="text-sm text-slate-400 mb-2">{achievement.description}</div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 min-w-0">
                      {formatNumber(current)} / {formatNumber(achievement.requirement)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Reward: +{formatNumber(achievement.reward)} cookies
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
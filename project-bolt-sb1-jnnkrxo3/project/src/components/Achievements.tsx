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
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-yellow-200">
      <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
        <span className="text-3xl">🏆</span>
        Achievements ({unlockedAchievements.length}/{achievements.length})
      </h2>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {/* Unlocked Achievements */}
        {unlockedAchievements.map(achievement => (
          <div
            key={achievement.id}
            className="p-3 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-yellow-800 flex items-center gap-2">
                  {achievement.name}
                  <span className="text-green-600 text-sm">✓ Unlocked</span>
                </div>
                <div className="text-sm text-yellow-700 mb-1">{achievement.description}</div>
                <div className="text-xs text-yellow-600">
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
              className="p-3 rounded-lg bg-gray-100 border-2 border-gray-300 opacity-75"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl grayscale">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-gray-700">{achievement.name}</div>
                  <div className="text-sm text-gray-600 mb-1">{achievement.description}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatNumber(current)} / {formatNumber(achievement.requirement)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
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
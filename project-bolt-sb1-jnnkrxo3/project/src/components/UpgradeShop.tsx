import React from 'react';
import { GameState } from '../types/game';
import { upgrades, generators } from '../data/gameData';

interface UpgradeShopProps {
  gameState: GameState;
  onBuyUpgrade: (upgradeId: string) => void;
  onBuyGenerator: (generatorId: string) => void;
}

export const UpgradeShop = ({ gameState, onBuyUpgrade, onBuyGenerator }: UpgradeShopProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toLocaleString();
  };

  const getUpgradeCost = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId)!;
    const currentLevel = gameState.upgrades[upgradeId] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
  };

  const getGeneratorCost = (generatorId: string) => {
    const generator = generators.find(g => g.id === generatorId)!;
    const currentCount = gameState.generators[generatorId] || 0;
    
    // BONUS drill always costs 35M
    if (generatorId === 'bonus-drill') {
      return 35000000;
    }
    
    return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, currentCount));
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-200">
      <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
        <span className="text-3xl">🛒</span>
        Cookie Empire Shop
      </h2>
      
      <div className="space-y-6">
        {/* Click Upgrades */}
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
            <span className="text-2xl">👆</span>
            Click Power Upgrades
          </h3>
          <div className="grid gap-2">
            {upgrades.filter(u => u.type === 'click').map(upgrade => {
              const cost = getUpgradeCost(upgrade.id);
              const level = gameState.upgrades[upgrade.id] || 0;
              const canAfford = gameState.cookies >= cost;
              
              return (
                <button
                  key={upgrade.id}
                  onClick={() => onBuyUpgrade(upgrade.id)}
                  disabled={!canAfford}
                  className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                    canAfford 
                      ? 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 hover:from-orange-200 hover:to-red-200 hover:scale-102 cursor-pointer' 
                      : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-orange-800 flex items-center gap-2">
                      <span className="text-xl">{upgrade.icon}</span>
                      {upgrade.name} {level > 0 && `(${level})`}
                    </span>
                    <span className="text-orange-600 font-bold">{formatNumber(cost)} 🍪</span>
                  </div>
                  <p className="text-sm text-orange-700">{upgrade.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Passive Upgrades */}
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Passive Upgrades
          </h3>
          <div className="grid gap-2">
            {upgrades.filter(u => u.type === 'passive').map(upgrade => {
              const cost = getUpgradeCost(upgrade.id);
              const level = gameState.upgrades[upgrade.id] || 0;
              const canAfford = gameState.cookies >= cost;
              
              return (
                <button
                  key={upgrade.id}
                  onClick={() => onBuyUpgrade(upgrade.id)}
                  disabled={!canAfford}
                  className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                    canAfford 
                      ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 hover:from-blue-200 hover:to-cyan-200 hover:scale-102 cursor-pointer' 
                      : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-blue-800 flex items-center gap-2">
                      <span className="text-xl">{upgrade.icon}</span>
                      {upgrade.name} {level > 0 && `(${level})`}
                    </span>
                    <span className="text-blue-600 font-bold">{formatNumber(cost)} 🍪</span>
                  </div>
                  <p className="text-sm text-blue-700">{upgrade.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generators */}
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            Cookie Minions
          </h3>
          <div className="grid gap-2">
            {generators.map(generator => {
              const cost = getGeneratorCost(generator.id);
              const count = gameState.generators[generator.id] || 0;
              const canAfford = gameState.cookies >= cost;
              
              const displayCost = formatNumber(cost) + ' 🍪';
              
              return (
                <button
                  key={generator.id}
                  onClick={() => onBuyGenerator(generator.id)}
                  disabled={!canAfford}
                  className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${
                    canAfford 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 hover:from-green-200 hover:to-emerald-200 hover:scale-102 cursor-pointer' 
                      : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-green-800 flex items-center gap-2">
                      <span className="text-xl">{generator.icon}</span>
                      {generator.name} {count > 0 && `(${count})`}
                    </span>
                    <span className="text-green-600 font-bold">{displayCost}</span>
                  </div>
                  <p className="text-sm text-green-700 mb-1">{generator.description}</p>
                  <p className="text-xs text-green-600">
                    Each produces {generator.cookiesPerSecond} CPS
                    {count > 0 && ` • Total: ${generator.cookiesPerSecond * count} CPS`}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
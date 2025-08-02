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
    
    if (generatorId === 'bonus-drill') {
      return 35000000;
    }
    
    return Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, currentCount));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Industrial Shop</h2>
        <p className="text-slate-400">Upgrade your cookie production empire</p>
      </div>
      
      {/* Click Upgrades */}
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <img src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=32" alt="Click" className="w-5 h-5 rounded" />
          </div>
          Click Power Upgrades
        </h3>
        <div className="space-y-3">
          {upgrades.filter(u => u.type === 'click').map(upgrade => {
            const cost = getUpgradeCost(upgrade.id);
            const level = gameState.upgrades[upgrade.id] || 0;
            const canAfford = gameState.cookies >= cost;
            
            return (
              <button
                key={upgrade.id}
                onClick={() => onBuyUpgrade(upgrade.id)}
                disabled={!canAfford}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 border ${
                  canAfford 
                    ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-orange-500 hover:from-slate-600 hover:to-slate-500 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-orange-500/20' 
                    : 'bg-slate-800 border-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={upgrade.icon} alt={upgrade.name} className="w-8 h-8 rounded object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white flex items-center gap-2">
                        {upgrade.name} {level > 0 && <span className="text-orange-400 text-sm">Lv.{level}</span>}
                      </span>
                      <span className="text-orange-400 font-bold text-lg">{formatNumber(cost)}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{upgrade.description}</p>
                    <div className="text-xs text-orange-300">
                      Effect: +{upgrade.effect} cookies per click
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Passive Upgrades */}
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <img src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=32" alt="Passive" className="w-5 h-5 rounded" />
          </div>
          Passive Income Upgrades
        </h3>
        <div className="space-y-3">
          {upgrades.filter(u => u.type === 'passive').map(upgrade => {
            const cost = getUpgradeCost(upgrade.id);
            const level = gameState.upgrades[upgrade.id] || 0;
            const canAfford = gameState.cookies >= cost;
            
            return (
              <button
                key={upgrade.id}
                onClick={() => onBuyUpgrade(upgrade.id)}
                disabled={!canAfford}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 border ${
                  canAfford 
                    ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-blue-500 hover:from-slate-600 hover:to-slate-500 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-blue-500/20' 
                    : 'bg-slate-800 border-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={upgrade.icon} alt={upgrade.name} className="w-8 h-8 rounded object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white flex items-center gap-2">
                        {upgrade.name} {level > 0 && <span className="text-blue-400 text-sm">Lv.{level}</span>}
                      </span>
                      <span className="text-blue-400 font-bold text-lg">{formatNumber(cost)}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{upgrade.description}</p>
                    <div className="text-xs text-blue-300">
                      Effect: +{upgrade.effect} cookies per second
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generators */}
      <div>
        <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <img src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=32" alt="Generator" className="w-5 h-5 rounded" />
          </div>
          Production Units
        </h3>
        <div className="space-y-3">
          {generators.map(generator => {
            const cost = getGeneratorCost(generator.id);
            const count = gameState.generators[generator.id] || 0;
            const canAfford = gameState.cookies >= cost;
            
            return (
              <button
                key={generator.id}
                onClick={() => onBuyGenerator(generator.id)}
                disabled={!canAfford}
                className={`w-full p-4 rounded-lg text-left transition-all duration-200 border ${
                  canAfford 
                    ? 'bg-gradient-to-r from-slate-700 to-slate-600 border-green-500 hover:from-slate-600 hover:to-slate-500 hover:scale-[1.02] cursor-pointer shadow-lg hover:shadow-green-500/20' 
                    : 'bg-slate-800 border-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src={generator.icon} alt={generator.name} className="w-8 h-8 rounded object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white flex items-center gap-2">
                        {generator.name} {count > 0 && <span className="text-green-400 text-sm">x{count}</span>}
                      </span>
                      <span className="text-green-400 font-bold text-lg">{formatNumber(cost)}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{generator.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-300">
                        Each: {generator.cookiesPerSecond} CPS
                      </span>
                      {count > 0 && (
                        <span className="text-green-300">
                          Total: {generator.cookiesPerSecond * count} CPS
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
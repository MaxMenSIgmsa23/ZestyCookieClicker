import { useState, useEffect, useCallback } from 'react';
import { GameState, CookieType, Buff, User } from '../types/game';
import { cookieTypes, upgrades, generators, achievements } from '../data/gameData';

const defaultGameState: GameState = {
  cookies: 0,
  totalCookies: 0,
  clickPower: 1,
  cookiesPerSecond: 0,
  prestigeLevel: 0,
  dominancePoints: 0,
  currentCookieType: cookieTypes[0],
  unlockedCookieTypes: [cookieTypes[0]],
  upgrades: {},
  generators: {},
  achievements: [],
  buffs: [],
  user: null,
  stats: {
    totalClicks: 0,
    prestigeClicks: 0,
    startTime: Date.now(),
    fastClicks: 0,
    fastClickTimer: 0,
    promosUsed: [],
  },
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('clickmedaddy-save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultGameState, ...parsed };
      } catch {
        return defaultGameState;
      }
    }
    return defaultGameState;
  });

  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem('clickmedaddy-save', JSON.stringify(gameState));
  }, [gameState]);

  // Update user playtime and experience
  useEffect(() => {
    if (!gameState.user) return;
    
    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev.user) return prev;
        
        const newPlayTime = prev.user.totalPlayTime + 1000; // Add 1 second
        const newExperience = prev.user.experience + 1; // Gain 1 XP per second
        const newLevel = Math.floor(newExperience / 1000) + 1;
        
        return {
          ...prev,
          user: {
            ...prev.user,
            totalPlayTime: newPlayTime,
            experience: newExperience,
            level: newLevel,
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.user]);

  // Passive cookie generation
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.cookiesPerSecond > 0) {
          const passiveGain = prev.cookiesPerSecond / 10; // 100ms intervals
          return {
            ...prev,
            cookies: prev.cookies + passiveGain,
            totalCookies: prev.totalCookies + passiveGain,
          };
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Update buffs
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        buffs: prev.buffs.filter(buff => 
          Date.now() - buff.startTime < buff.duration * 1000
        ),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const clickCookie = useCallback(() => {
    setGameState(prev => {
      const buffMultiplier = prev.buffs.reduce((acc, buff) => acc * buff.multiplier, 1);
      const cookieGain = prev.clickPower * prev.currentCookieType.clickMultiplier * buffMultiplier;
      
      const now = Date.now();
      let newFastClicks = prev.stats.fastClicks;
      let newFastClickTimer = prev.stats.fastClickTimer;
      
      // Reset fast click counter if more than 10 seconds have passed
      if (now - newFastClickTimer > 10000) {
        newFastClicks = 0;
        newFastClickTimer = now;
      }
      newFastClicks++;
      
      const newState = {
        ...prev,
        cookies: prev.cookies + cookieGain,
        totalCookies: prev.totalCookies + cookieGain,
        stats: {
          ...prev.stats,
          totalClicks: prev.stats.totalClicks + 1,
          prestigeClicks: prev.stats.prestigeClicks + 1,
          fastClicks: newFastClicks,
          fastClickTimer: newFastClickTimer,
        },
      };

      // Add experience for clicking if user is logged in
      if (newState.user) {
        newState.user = {
          ...newState.user,
          experience: newState.user.experience + 1,
          level: Math.floor((newState.user.experience + 1) / 1000) + 1,
        };
      }

      // Check for new achievements
      const newAchievements = achievements.filter(achievement => {
        if (newState.achievements.includes(achievement.id)) return false;
        
        switch (achievement.type) {
          case 'clicks':
            return newState.stats.totalClicks >= achievement.requirement;
          case 'cookies':
            return newState.totalCookies >= achievement.requirement;
          case 'generators':
            const totalGenerators = Object.values(newState.generators).reduce((sum, count) => sum + count, 0);
            return totalGenerators >= achievement.requirement;
          case 'prestige':
            return newState.prestigeLevel >= achievement.requirement;
          case 'clicks':
            return achievement.id === 'speed-demon' ? newFastClicks >= 100 : newState.stats.totalClicks >= achievement.requirement;
          default:
            return false;
        }
      });

      if (newAchievements.length > 0) {
        newState.achievements = [...newState.achievements, ...newAchievements.map(a => a.id)];
        newState.cookies += newAchievements.reduce((sum, a) => sum + a.reward, 0);
      }

      return newState;
    });
  }, []);

  const buyUpgrade = useCallback((upgradeId: string) => {
    setGameState(prev => {
      const upgrade = upgrades.find(u => u.id === upgradeId);
      if (!upgrade) return prev;

      const currentLevel = prev.upgrades[upgradeId] || 0;
      const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));

      if (prev.cookies < cost) return prev;

      const newState = {
        ...prev,
        cookies: prev.cookies - cost,
        upgrades: { ...prev.upgrades, [upgradeId]: currentLevel + 1 },
      };

      // Apply upgrade effects
      if (upgrade.type === 'click') {
        newState.clickPower = prev.clickPower + upgrade.effect;
      } else if (upgrade.type === 'passive') {
        newState.cookiesPerSecond = prev.cookiesPerSecond + upgrade.effect;
      }

      return newState;
    });
  }, []);

  const buyGenerator = useCallback((generatorId: string) => {
    setGameState(prev => {
      const generator = generators.find(g => g.id === generatorId);
      if (!generator) return prev;

      const currentCount = prev.generators[generatorId] || 0;
      
      // BONUS drill always costs 35M
      const cost = generatorId === 'bonus-drill' 
        ? 35000000 
        : Math.floor(generator.baseCost * Math.pow(generator.costMultiplier, currentCount));

      if (prev.cookies < cost) return prev;

      return {
        ...prev,
        cookies: prev.cookies - cost,
        generators: { ...prev.generators, [generatorId]: currentCount + 1 },
        cookiesPerSecond: prev.cookiesPerSecond + (generator.cookiesPerSecond * prev.currentCookieType.passiveMultiplier),
      };
    });
  }, []);

  const switchCookieType = useCallback((cookieType: CookieType) => {
    setGameState(prev => {
      if (!prev.unlockedCookieTypes.find(ct => ct.id === cookieType.id)) return prev;
      if (prev.cookies < cookieType.unlockCost) return prev;

      return {
        ...prev,
        cookies: prev.cookies - cookieType.unlockCost,
        currentCookieType: cookieType,
      };
    });
  }, []);

  const unlockCookieType = useCallback((cookieType: CookieType) => {
    setGameState(prev => {
      if (prev.unlockedCookieTypes.find(ct => ct.id === cookieType.id)) return prev;
      if (prev.totalCookies < cookieType.unlockRequirement) return prev;

      return {
        ...prev,
        unlockedCookieTypes: [...prev.unlockedCookieTypes, cookieType],
      };
    });
  }, []);

  const prestige = useCallback(() => {
    setGameState(prev => {
      if (prev.totalCookies < 1000000) return prev; // Minimum for prestige

      const dominanceGain = Math.floor(prev.totalCookies / 1000000);
      
      return {
        ...defaultGameState,
        prestigeLevel: prev.prestigeLevel + 1,
        dominancePoints: prev.dominancePoints + dominanceGain,
        clickPower: 1 + prev.dominancePoints * 0.1,
        stats: {
          totalClicks: prev.stats.totalClicks,
          prestigeClicks: 0,
          startTime: Date.now(),
          fastClicks: 0,
          fastClickTimer: 0,
        },
        achievements: prev.achievements,
      };
    });
  }, []);

  const addBuff = useCallback((buff: Buff) => {
    setGameState(prev => ({
      ...prev,
      buffs: [...prev.buffs.filter(b => b.id !== buff.id), buff],
    }));
  }, []);

  const usePromoCode = useCallback((code: string) => {
    setGameState(prev => {
      if (prev.stats.promosUsed.includes(code)) {
        return prev; // Already used this promo
      }
      
      if (code.toUpperCase() === 'BONUS') {
        // BONUS code now gives 35M cookies instead of a free drill
        const newState = {
          ...prev,
          cookies: prev.cookies + 35000000,
          stats: {
            ...prev.stats,
            promosUsed: [...(prev.stats.promosUsed || []), code.toUpperCase()],
          },
        };
        
        // Check for promo achievement
        if (!newState.achievements.includes('promo-hunter')) {
          newState.achievements = [...newState.achievements, 'promo-hunter'];
          newState.cookies += 5000000; // Achievement reward
        }
        
        return newState;
      }
      
      return prev;
    });
  }, []);

  const login = useCallback((username: string, password: string) => {
    // Simple local storage based authentication
    const users = JSON.parse(localStorage.getItem('cookie-users') || '{}');
    const user = users[username];
    
    if (user && user.password === password) {
      setGameState(prev => ({
        ...prev,
        user: {
          username: user.username,
          level: user.level,
          experience: user.experience,
          joinDate: user.joinDate,
          totalPlayTime: user.totalPlayTime,
        },
      }));
      return true;
    }
    return false;
  }, []);

  const register = useCallback((username: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('cookie-users') || '{}');
    
    if (users[username]) {
      return false; // Username already exists
    }
    
    const newUser = {
      username,
      password,
      level: 1,
      experience: 0,
      joinDate: Date.now(),
      totalPlayTime: 0,
    };
    
    users[username] = newUser;
    localStorage.setItem('cookie-users', JSON.stringify(users));
    
    setGameState(prev => ({
      ...prev,
      user: {
        username: newUser.username,
        level: newUser.level,
        experience: newUser.experience,
        joinDate: newUser.joinDate,
        totalPlayTime: newUser.totalPlayTime,
      },
    }));
    
    return true;
  }, []);

  const logout = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      user: null,
    }));
  }, []);

  return {
    gameState,
    clickCookie,
    buyUpgrade,
    buyGenerator,
    switchCookieType,
    unlockCookieType,
    prestige,
    addBuff,
    usePromoCode,
    login,
    register,
    logout,
  };
};
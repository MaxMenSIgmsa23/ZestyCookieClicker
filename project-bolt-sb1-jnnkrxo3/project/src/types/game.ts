export interface GameState {
  cookies: number;
  totalCookies: number;
  clickPower: number;
  cookiesPerSecond: number;
  prestigeLevel: number;
  dominancePoints: number;
  currentCookieType: CookieType;
  unlockedCookieTypes: CookieType[];
  upgrades: Record<string, number>;
  generators: Record<string, number>;
  achievements: string[];
  buffs: Buff[];
  user: User | null;
  stats: {
    totalClicks: number;
    prestigeClicks: number;
    startTime: number;
    fastClicks: number;
    fastClickTimer: number;
    promosUsed: string[];
  };
}

export interface User {
  username: string;
  level: number;
  experience: number;
  joinDate: number;
  totalPlayTime: number;
}

export interface CookieType {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockCost: number;
  clickMultiplier: number;
  passiveMultiplier: number;
  color: string;
  glowColor: string;
  unlockRequirement: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  effect: number;
  maxLevel?: number;
  type: 'click' | 'passive' | 'special';
  icon: string;
}

export interface Generator {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  cookiesPerSecond: number;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: 'clicks' | 'cookies' | 'upgrades' | 'generators' | 'prestige' | 'promo';
  reward: number;
  icon: string;
}

export interface Buff {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  duration: number;
  startTime: number;
  icon: string;
}
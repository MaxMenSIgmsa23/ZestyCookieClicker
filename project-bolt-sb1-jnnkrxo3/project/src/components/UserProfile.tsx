import React from 'react';
import { User, Trophy, Clock, Star, LogOut } from 'lucide-react';
import { User as UserType } from '../types/game';

interface UserProfileProps {
  user: UserType | null;
  onLogout: () => void;
  onShowLogin: () => void;
}

export const UserProfile = ({ user, onLogout, onShowLogin }: UserProfileProps) => {
  const formatPlayTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getPlayerRank = (level: number) => {
    if (level >= 100) return { name: 'Cookie Overlord', color: 'text-purple-400' };
    if (level >= 50) return { name: 'Cookie Master', color: 'text-gold-400' };
    if (level >= 25) return { name: 'Cookie Expert', color: 'text-blue-400' };
    if (level >= 10) return { name: 'Cookie Baker', color: 'text-green-400' };
    return { name: 'Cookie Apprentice', color: 'text-gray-400' };
  };

  if (!user) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-600">
        <div className="text-center">
          <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Guest Player</h3>
          <p className="text-slate-400 text-sm mb-4">
            Create an account to save your progress and compete with others!
          </p>
          <button
            onClick={onShowLogin}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  const rank = getPlayerRank(user.level);
  const experienceToNext = (user.level + 1) * 1000;
  const experienceProgress = (user.experience % 1000) / 1000;

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-600">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user.username}</h3>
            <p className={`text-sm font-medium ${rank.color}`}>{rank.name}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-slate-400 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-300 text-sm">Level {user.level}</span>
          </div>
          <span className="text-slate-400 text-xs">
            {user.experience % 1000} / 1000 XP
          </span>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${experienceProgress * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <div className="text-white font-semibold">{user.level}</div>
            <div className="text-slate-400 text-xs">Level</div>
          </div>
          
          <div className="text-center">
            <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <div className="text-white font-semibold">{formatPlayTime(user.totalPlayTime)}</div>
            <div className="text-slate-400 text-xs">Playtime</div>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-slate-700">
          <div className="text-slate-400 text-xs">
            Member since {new Date(user.joinDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
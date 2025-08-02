import React, { useState, useEffect } from 'react';
import { Cookie } from './components/Cookie';
import { UpgradeShop } from './components/UpgradeShop';
import { Stats } from './components/Stats';
import { CookieSelector } from './components/CookieSelector';
import { PrestigePanel } from './components/PrestigePanel';
import { Achievements } from './components/Achievements';
import { PromoCodePanel } from './components/PromoCodePanel';
import { UserProfile } from './components/UserProfile';
import { LoginModal } from './components/LoginModal';
import { useGameState } from './hooks/useGameState';
import { Settings, Menu, X } from 'lucide-react';

function App() {
  const {
    gameState,
    clickCookie,
    buyUpgrade,
    buyGenerator,
    switchCookieType,
    unlockCookieType,
    prestige,
    usePromoCode,
    login,
    register,
    logout,
  } = useGameState();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('shop');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const handleLogin = (username: string, password: string) => {
    if (login(username, password)) {
      setShowLoginModal(false);
    } else {
      alert('Invalid credentials! Try again or create a new account.');
    }
  };

  const handleRegister = (username: string, password: string) => {
    if (register(username, password)) {
      setShowLoginModal(false);
    } else {
      alert('Username already exists! Try a different one.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Steam-like Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <img 
                  src="https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop" 
                  alt="Cookie" 
                  className="w-8 h-8 rounded object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cookie Empire</h1>
                <p className="text-sm text-slate-400">Industrial Cookie Production Simulator</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">
                {formatNumber(gameState.cookies)} Cookies
              </div>
              <div className="text-sm text-slate-400">
                {formatNumber(gameState.cookiesPerSecond)} per second
              </div>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-slate-800 border-r border-slate-600`}>
          <div className="p-4 space-y-4">
            <UserProfile 
              user={gameState.user} 
              onLogout={logout}
              onShowLogin={() => setShowLoginModal(true)}
            />
            
            <nav className="space-y-2">
              {[
                { id: 'shop', label: 'Shop', icon: '🛒' },
                { id: 'cookies', label: 'Cookie Types', icon: '🍪' },
                { id: 'achievements', label: 'Achievements', icon: '🏆' },
                { id: 'prestige', label: 'Prestige', icon: '👑' },
                { id: 'promo', label: 'Promo Codes', icon: '🎁' },
                { id: 'stats', label: 'Statistics', icon: '📊' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Cookie Clicking Area */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <div className="relative z-10 text-center">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">
                  {gameState.currentCookieType.name}
                </h2>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                  {gameState.currentCookieType.description}
                </p>
              </div>
              
              <Cookie
                cookieType={gameState.currentCookieType}
                onClick={clickCookie}
                size={300}
              />
              
              <div className="mt-8 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  Click Power: {formatNumber(gameState.clickPower)}
                </div>
                <div className="text-slate-400">
                  Click to produce cookies!
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-96 bg-slate-800 border-l border-slate-600 overflow-y-auto">
            <div className="p-6">
              {activeTab === 'shop' && (
                <UpgradeShop
                  gameState={gameState}
                  onBuyUpgrade={buyUpgrade}
                  onBuyGenerator={buyGenerator}
                />
              )}
              {activeTab === 'cookies' && (
                <CookieSelector
                  gameState={gameState}
                  onSwitchCookie={switchCookieType}
                  onUnlockCookie={unlockCookieType}
                />
              )}
              {activeTab === 'achievements' && (
                <Achievements gameState={gameState} />
              )}
              {activeTab === 'prestige' && (
                <PrestigePanel gameState={gameState} onPrestige={prestige} />
              )}
              {activeTab === 'promo' && (
                <PromoCodePanel onUsePromoCode={usePromoCode} />
              )}
              {activeTab === 'stats' && (
                <Stats gameState={gameState} />
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default App;
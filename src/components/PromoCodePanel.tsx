import React, { useState } from 'react';

interface PromoCodePanelProps {
  onUsePromoCode: (code: string) => void;
}

export const PromoCodePanel = ({ onUsePromoCode }: PromoCodePanelProps) => {
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promoCode.trim()) {
      setMessage('Please enter a promotional code!');
      return;
    }
    
    if (promoCode.toUpperCase() === 'BONUS') {
      onUsePromoCode(promoCode);
      setMessage('🎉 BONUS code activated! You received 35M cookies!');
      setPromoCode('');
    } else {
      setMessage('❌ Invalid promotional code. Please try again.');
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Promotional Codes</h2>
        <p className="text-slate-400">Enter special codes for exclusive rewards</p>
      </div>
      
      <div className="bg-gradient-to-br from-green-800 to-emerald-800 rounded-lg p-6 border border-green-600">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-300 mb-2">
              Promotional Code
            </label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code here..."
              className="w-full px-4 py-3 bg-slate-700 border border-green-500 rounded-lg text-white placeholder-slate-400 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-center font-mono text-lg uppercase"
              maxLength={20}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Activate Code
          </button>
          
          {message && (
            <div className={`text-center p-3 rounded-lg border ${
              message.includes('🎉') 
                ? 'bg-green-900/50 border-green-500 text-green-200' 
                : 'bg-red-900/50 border-red-500 text-red-200'
            }`}>
              {message}
            </div>
          )}
        </form>
        
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
          <div className="text-center">
            <div className="text-green-400 font-semibold mb-2">💡 Insider Tip</div>
            <div className="text-slate-300 text-sm">
              Try the code "BONUS" for a massive cookie boost!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};